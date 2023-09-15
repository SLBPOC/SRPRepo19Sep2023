import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Renderer2, Input, EventEmitter, Output } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
//import { WellName } from '../model/wellname';
import { WellModel } from '../../../model/wellModel'
import { AlertList } from '../../../model/alert-list'
import { AlertListService } from '../../../services/alert-list.service';
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
  theme = 'light';
  dataSource: any = [];
  WellList!: WellModel[];
  alertList!: AlertList[];
  snoozeByTime: number = 1;
  clearAlertsComments!: string;
  selectedColumn: string[] = [];
  displayedColumns: string[] = ['wellName', 'date', 'category', 'desc', 'action'];
  // columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild('searchQueryInput') searchInput: ElementRef<HTMLInputElement>;
  @Input() sortAndFilterPayload: any;

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


  //legend variables
  TotalCount: number = 0;
  High: number = 0;
  Medium: number = 0;
  Low: number = 0;
  Clear: number = 0;
  pageSizeOption = [10, 20, 30]
  ids: number[];


  constructor( private service: AlertListService, private router: Router, public treeviewService: TreeViewService) { }


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
      if (x != undefined && x.length > 0 && x.some(m => m.type == NodeType.Wells)) {
        this.ids = x.filter(m => m.type == NodeType.Wells).map(m => m.nodeId);
      }
      else
        this.ids = [];
      this.GetAlertListWithFilters();;
    })
  }



  GetAlertListWithFilters() {
    this.loading = true;
    var SearchModel: any;
    if(this.sortAndFilterPayload !=undefined){
      SearchModel = this.sortAndFilterPayload
    }
    else {
      SearchModel = this.createModel();
    }
    this.service.getAlertList(SearchModel).subscribe(response => {
      // if (response.hasOwnProperty('data')) {
        this.loading = false;
        this.pageSizeOption = [10, 15, 20, response.alertsLevelDto.totalCount]
        // this.getPageSizeOptions();
        this.alertList = response.alerts;
        // this.WellList.forEach(x => this.prepareChart(x));
        this.dataSource = new MatTableDataSource<AlertList>(this.alertList);
        setTimeout(() => {
          this.paginator.pageIndex = this.currentPage;
          this.paginator.length = response.alertsLevelDto.totalCount;
        });

        this.TotalCount = response.alertsLevelDto.totalCount;
        this.High = response.alertsLevelDto.totalHigh;
        this.Medium = response.alertsLevelDto.totalMedium;
        this.Low = response.alertsLevelDto.totalLow;
        this.Clear = response.alertsLevelDto.totalCleared;
        this.dataSource.paginator = this.paginator;

      // }

    });
  }


  refreshGrid(payload: any) {
    this.seachByStatus=""; // Added by Gayatri 9/8/2023

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
            this.pageSizeOption = [10, 15, 20, response.alertsLevelDto.totalCount]
            // this.getPageSizeOptions();
            this.alertList = response.data;
            // this.WellList.forEach(x => this.prepareChart(x));
            this.dataSource = new MatTableDataSource<AlertList>(this.alertList);
            setTimeout(() => {
              this.paginator.pageIndex = this.currentPage;
              this.paginator.length = response.alertsLevelDto.totalCount;
            });
    
            this.TotalCount = response.totalCount;
            this.High = response.totalHigh;
            this.Medium = response.totalMedium;
            this.Low = response.totalLow;
            this.Clear = response.alertsLevelDto.totalCleared;
            this.dataSource.paginator = this.paginator;
    
          // }
        })
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

