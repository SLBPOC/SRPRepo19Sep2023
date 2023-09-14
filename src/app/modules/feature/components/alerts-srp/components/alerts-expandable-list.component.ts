import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Renderer2, Input, EventEmitter, Output } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';
//import { WellName } from '../model/wellname';
import { WellModel } from '../../../model/wellModel'
import { AlertList } from '../../../model/alert-list'
import { AlertListService } from '../../../services/alert-list.service';
import { FormControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { fromEvent, map, debounceTime, distinctUntilChanged, tap } from 'rxjs'
import * as HighCharts from 'highcharts';
import { Router } from '@angular/router';
import { TreeViewService } from '../../../services/tree-view.service';
import { NodeType } from '../../../services/models';
import {animate, state, style, transition, trigger} from '@angular/animations';

interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-alerts-expandable-list',
  templateUrl: './alerts-expandable-list.component.html',
  styleUrls: ['./alerts-expandable-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class AlertsExpandableListComponent implements OnInit {

  foods: Food[] = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'},
  ];
  theme = 'light';
  dataSource: any = [];
  WellList!: WellModel[];
  alertList!: AlertList[];
  snoozeByTime: number = 1;
  clearAlertsComments!: string;
  selectedColumn: string[] = [];
  displayedColumns: string[] = ['wellName', 'date', 'desc', 'action'];
  displayableExtraColumns: { label: string, accessor: string, header: string }[] = [];
  extraColumnsCtrl: any = new FormControl('');
  extraColumnsList: { label: string, accessor: string, header: string }[] = [
    { label: 'Effective Runtime(%)', accessor: 'effectiveRunTime', header: 'EffectiveRunTime.value' },
    { label: 'Cycles Today', accessor: 'cyclesToday', header: 'CyclesToday.value' },
    { label: 'Structural Load(%)', accessor: 'structuralLoad', header: 'StructuralLoad.value' },
    { label: 'MinMax Load(%)', accessor: 'minMaxLoad', header: 'MinMaxLoad.value' },
    { label: 'Gearbox Load(%)', accessor: 'gearboxLoad', header: 'GearboxLoad.value' },
    { label: 'Rod Stress(%)', accessor: 'rodStress', header: 'RodStress.value' }
  ];
  // columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('extraColumns', { static: true }) private extraColumns!: MatSelect;

  @ViewChild('searchQueryInput') searchInput: ElementRef<HTMLInputElement>;

  HighCharts: typeof HighCharts = HighCharts;

  searchText: string = "";
  sortDirection: string = "";
  sortColumn: string = "";
  pageSize: number = 5;
  pageNumber = 1;
  currentPage = 0;
  totalCount = 0;
  model: any = {};
  seachByStatus: string = "";
  loading = true;

  //filter variables;
  commStatus: any[];
  controllerStatus: any[];
  inferredProduction: any[];
  pumpFillage: any[];
  pumpingType: any[];
  spm: any[];
  wellNames: any[];


  //legend variables
  TotalCount: number = 0;
  OverPumping: number = 0;
  OptimalPumping: number = 0;
  UnderPumping: number = 0;

  minmaxChartData: any[] = [];  //min max chart data array
  pageSizeOption = [10, 20, 30]
  ids: number[];
  respdata: any


  constructor(private _liveAnnouncer: LiveAnnouncer, private service: AlertListService, private router: Router, public treeviewService: TreeViewService) { }


  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
    fromEvent<any>(this.searchInput.nativeElement, 'keyup').pipe(
      map(event => event.target.value),
      debounceTime(500),
      distinctUntilChanged(),
      tap(x => this.searchText = x)
    ).subscribe(x => {
      if (x != undefined && x.trim() != "") {
        this.GetAlertListWithFilters();;
      }
    });
  }

  ngOnInit(): void {
    // this.GetAlertListWithFilters();
    this.treeviewService.selectedNodes.subscribe(x => {
      console.log(x);
      if (x != undefined && x.length > 0 && x.some(m => m.Type == NodeType.Wells)) {
        this.ids = x.filter(m => m.Type == NodeType.Wells).map(m => m.NodeId);
      }
      else
        this.ids = [];
      this.GetAlertListWithFilters();;
    })
  }



  GetAlertListWithFilters() {
    this.loading = true;
    var SearchModel = this.createModel();
    this.service.getAlertList(SearchModel).subscribe(response => {
      // if (response.hasOwnProperty('data')) {
        this.loading = false;
        this.pageSizeOption = [10, 15, 20, response.totalCount]
        // this.getPageSizeOptions();
        this.alertList = response.alerts;
        // this.WellList.forEach(x => this.prepareChart(x));
        this.dataSource = new MatTableDataSource<AlertList>(this.alertList);
        setTimeout(() => {
          this.paginator.pageIndex = this.currentPage;
          this.paginator.length = response.totalCount;
        });

        this.TotalCount = response.totalCount;
        this.OverPumping = response.totalOverpumping;
        this.OptimalPumping = response.totalOptimalPumping;
        this.UnderPumping = response.totalUnderpumping;
        this.dataSource.paginator = this.paginator;

      // }

    });
  }


  refreshGrid(payload: any) {
    this.seachByStatus=""; // Added by Gayatri 9/8/2023
    this.commStatus = payload.commStatus;
    this.controllerStatus = payload.controllerStatus;
    this.inferredProduction = payload.inferredProduction;
    this.pumpFillage = payload.pumpFillage;
    this.pumpingType = payload.pumpingType;
    this.spm = payload.spm;
    this.wellNames = payload.wellNames;

    this.GetAlertListWithFilters();;
  }

  //Create Model for search
  createModel(this: any) {
    let dateObj = {
      "fromDate": "",
      "toDate": ""
    }
    this.model.pageSize = this.pageSize;
    this.model.pageNumber = this.pageNumber;
    this.model.searchText = this.searchText ? this.searchText : "";
    this.model.sortColumn = this.sortColumn ? this.sortColumn : "";
    this.model.sortDirection = this.sortDirection ? this.sortDirection : "";
    this.model.searchStatus = this.seachByStatus ? this.seachByStatus : "";
    this.model.dateRange = dateObj   

    return this.model;
  }

  search(data: Event) {
    const val = (data.target as HTMLInputElement).value;
    this.dataSource.filter = val;

  }

  ClearSearch() {
    this.pageNumber = 1;
    this.seachByStatus = "";
    this.searchText = "";
    this.ids = [];
    this.GetAlertListWithFilters();;
  }

  RefreshGrid() {
        const payload = {
          "pageSize": 5,
          "pageNumber": 1,
          "searchText": "",
          "sortColumn": "",
          "sortDirection": "",
          "searchStatus": ""
      }
    
        this.service.getAlertList(payload).subscribe((response: any) => {
          // if (response.hasOwnProperty('data')) {
            this.loading = false;
            this.pageSizeOption = [10, 15, 20, response.totalCount]
            // this.getPageSizeOptions();
            this.alertList = response.data;
            // this.WellList.forEach(x => this.prepareChart(x));
            this.dataSource = new MatTableDataSource<AlertList>(this.alertList);
            setTimeout(() => {
              this.paginator.pageIndex = this.currentPage;
              this.paginator.length = response.totalCount;
            });
    
            this.TotalCount = response.totalCount;
            this.OverPumping = response.totalOverpumping;
            this.OptimalPumping = response.totalOptimalPumping;
            this.UnderPumping = response.totalUnderpumping;
            this.dataSource.paginator = this.paginator;
    
          // }
        })
      }

  onChangeDemo(event: any) {
    if (event.checked) {
      if (this.selectedColumn.filter(resp => event.source.value === resp)) {
        this.selectedColumn.push(event.source.value)
        // this.displayedColumns = [...this.displayedColumns.filter((column: string) => !this.extraColumnsList.find(({ header }) => header === column)), ...[...new Set(this.selectedColumn)]];
        this.displayableExtraColumns = this.extraColumnsList.filter((extraColumn: { label: string, accessor: string, header: string }) => [...new Set(this.selectedColumn)].includes(extraColumn.header));
      }
    } else {
      this.selectedColumn = this.selectedColumn.filter(function (e) { return e !== event.source.value })
      // this.displayedColumns = [...this.displayedColumns.filter((column: string) => !this.extraColumnsList.find(({ header }) => header === column)), ...this.selectedColumn];
      this.displayableExtraColumns = this.extraColumnsList.filter((extraColumn: { label: string, accessor: string, header: string }) => this.selectedColumn.includes(extraColumn.header));
    }
  }



  public handlePage(e: any) {
    this.pageNumber = e.pageIndex;
    this.pageSize = e.pageSize;
    this.sortDirection = this.sort.direction;
    this.sortColumn = (typeof this.sort.active !== "undefined") ? this.sort.active : "";
    this.GetAlertListWithFilters();;
  }

  pageChanged(event: PageEvent) {
    console.log({ event });
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.pageNumber = event.pageIndex + 1;
    this.GetAlertListWithFilters();;
  }

  public onSortChanged(e: any) {
    this.pageNumber = this.pageNumber;
    this.pageSize = this.pageSize;
    this.sortDirection = this.sort.direction;
    this.sortColumn = (typeof this.sort.active !== "undefined") ? this.sort.active : "";
    this.GetAlertListWithFilters();;
  }

  // GetRandomNumbers(isNegative: boolean = true) {
  //   var integers = [];
  //   for (let index = 0; index < 7; index++) {
  //     integers.push([index + 1, (Math.random() * (isNegative ? 21 : 10)) - (isNegative ? 10 : 0)])
  //   }
  //   return integers;
  // }

  // GetMinMaxRandomNumbers(isNegative: boolean = true) {   
  //   this.minmaxChartData=[];
  //   this.minmaxChartData.push({name:"min",data:this.GetRandomNumbers(false)});
  //   this.minmaxChartData.push({name:"max",data:this.GetRandomNumbers(false)});
  //   return this.minmaxChartData; 
  // }

}

