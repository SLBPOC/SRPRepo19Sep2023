import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';
//import { WellName } from '../model/wellname';
import { WellModel } from '../../model/wellModel'
import { WellsService } from '../../services/wells.service';
import { FormControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { fromEvent, map, debounceTime, distinctUntilChanged, tap } from 'rxjs'
import * as HighCharts from 'highcharts';
import { Router } from '@angular/router';


@Component({
  selector: 'app-wells',
  templateUrl: './wells.component.html',
  styleUrls: ['./wells.component.scss']
})
export class WellsComponent {

  dataSource: any = [];
  WellList!: WellModel[];
  selectedColumn: string[] = [];
  displayedColumns: string[] = ['WellStatus', 'WellName', 'DateAndTime', 'CommStatus', 'ControllerStatus', 'SPM', 'PumpFillage', 'InferredProduction', 'NoOfAlerts'];
  displayableExtraColumns: { label: string, accessor: string, header: string }[] = [];
  extraColumnsCtrl: any = new FormControl('');
  extraColumnsList: { label: string, accessor: string, header: string }[] = [
    { label: 'Effective Runtime(%)', accessor: 'effectiveRunTime', header: 'EffectiveRunTime' },
    { label: 'Cycles Today', accessor: 'cyclesToday', header: 'CyclesToday' },
    { label: 'Structural Load(%)', accessor: 'structuralLoad', header: 'StructuralLoad' },
    { label: 'MinMax Load(%)', accessor: 'minMaxLoad', header: 'MinMaxLoad' },
    { label: 'Gearbox Load(%)', accessor: 'gearboxLoad', header: 'GearboxLoad' },
    { label: 'Rod Stress(%)', accessor: 'rodStress', header: 'RodStress' }
  ];
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
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

  TotalCount: number = 0;
  OverPumping: number = 0;
  OptimalPumping: number = 0;
  UnderPumping: number = 0;



  constructor(private _liveAnnouncer: LiveAnnouncer, private service: WellsService, private router: Router) { }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    fromEvent<any>(this.searchInput.nativeElement, 'keyup').pipe(
      map(event => event.target.value),
      debounceTime(500),
      distinctUntilChanged(),
      tap(x => this.searchText = x)
    ).subscribe(x => {
      if (x != undefined && x.trim() != "") {
        this.GetWellDetailsWithFilters();
      }
    });
  }

  ngOnInit(): void {
    this.GetWellDetailsWithFilters();
  }

  GetWellDetails() {
    this.loading = true;
    this.service.getWellDetails().subscribe((response: any) => {
      this.loading = false;
      this.WellList = response;
      this.dataSource = new MatTableDataSource<WellModel>(this.WellList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  // GetWellDetailsWithFilters()
  // {
  //   var SearchModel = this.createModel();
  //   this.service.getWellDetailsWithFilters(SearchModel).subscribe(response => {
  //     if(response.hasOwnProperty('data')) {
  //       this.WellList = response.data;    
  //       this.dataSource = new MatTableDataSource<WellModel>(this.WellList);
  //       this.dataSource.paginator = this.paginator;
  //       this.dataSource.sort = this.sort;
  //       this.dataSource.length= response.totalCount;

  //       this.TotalCount=response.totalCount;
  //       this.OverPumping=response.totalOverpumping;
  //       this.OptimalPumping=response.totalOptimalPumping;
  //       this.UnderPumping=response.totalUnderpumping;
  //     }

  //   });
  // }

  GetWellDetailsWithFilters() {
    this.loading = true;
    var SearchModel = this.createModel();
    this.service.getWellDetailsWithFilters(SearchModel).subscribe(response => {
      if (response.hasOwnProperty('data')) {
        this.loading = false;
        this.WellList = response.data;
        this.WellList.forEach(x => this.prepareChart(x));
        this.dataSource = new MatTableDataSource<WellModel>(this.WellList);
        setTimeout(() => {
          this.paginator.pageIndex = this.currentPage;
          this.paginator.length = response.totalCount;
        });

        this.TotalCount = response.totalCount;
        this.OverPumping = response.totalOverpumping;
        this.OptimalPumping = response.totalOptimalPumping;
        this.UnderPumping = response.totalUnderpumping;
      }

    });
  }



  //Create Model for search
  createModel(this: any) {
    this.model.pageSize = this.pageSize;
    this.model.pageNumber = this.pageNumber;
    this.model.searchText = this.searchText ? this.searchText : "";
    this.model.sortColumn = this.sortColumn ? this.sortColumn : "";
    this.model.sortDirection = this.sortDirection ? this.sortDirection : "";
    this.model.searchStatus = this.seachByStatus ? this.seachByStatus : "";

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
    this.GetWellDetailsWithFilters();
  }

  RefreshGrid() {
    this.pageNumber = 1;
    this.seachByStatus = "";
    this.searchText = "";
    this.GetWellDetailsWithFilters();
  }

  // getSelectedValues(): void {
  //   this.extraColumns.close();
  //   const selectedColumns: string[] = this.extraColumnsCtrl.value ;
  //   this.displayedColumns = [...this.displayedColumns.filter((column: string) => !this.extraColumnsList.find(({accessor}) => accessor === column)), ...selectedColumns];
  //   this.displayableExtraColumns = this.extraColumnsList.filter((extraColumn: {label: string, accessor: string}) => selectedColumns.includes(extraColumn.accessor));
  // }

  onChangeDemo(event: any) {
    if (event.checked) {
      if (this.selectedColumn.filter(resp => event.source.value === resp)) {
        this.selectedColumn.push(event.source.value)
        this.displayedColumns = [...this.displayedColumns.filter((column: string) => !this.extraColumnsList.find(({ header }) => header === column)), ...[...new Set(this.selectedColumn)]];
        this.displayableExtraColumns = this.extraColumnsList.filter((extraColumn: { label: string, accessor: string,header:string }) => [...new Set(this.selectedColumn)].includes(extraColumn.header));
      }
    } else {
      this.selectedColumn = this.selectedColumn.filter(function (e) { return e !== event.source.value })
      this.displayedColumns = [...this.displayedColumns.filter((column: string) => !this.extraColumnsList.find(({ header }) => header === column)), ...this.selectedColumn];
      this.displayableExtraColumns = this.extraColumnsList.filter((extraColumn: { label: string, accessor: string,header:string }) => this.selectedColumn.includes(extraColumn.header));
    }
  }

  // PaginationCalled(event :any) // (click)="PaginationCalled($event)" working when we change page index but not on pageSizeOption change
  // {
  //   var a= this.paginator.pageIndex;
  //   var b= this.paginator.pageSize;
  //   var c= this.sort.direction;
  //   var d= this.sort.active;c
  // }

  public handlePage(e: any) {
    this.pageNumber = e.pageIndex;
    this.pageSize = e.pageSize;
    this.sortDirection = this.sort.direction;
    this.sortColumn = (typeof this.sort.active !== "undefined") ? this.sort.active : "";
    this.GetWellDetailsWithFilters();
  }

  pageChanged(event: PageEvent) {
    console.log({ event });
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.pageNumber = event.pageIndex + 1;
    this.GetWellDetailsWithFilters();
  }

  public onSortChanged(e: any) {
    this.pageNumber = this.pageNumber;
    this.pageSize = this.pageSize;
    this.sortDirection = this.sort.direction;
    this.sortColumn = (typeof this.sort.active !== "undefined") ? this.sort.active : "";
    this.GetWellDetailsWithFilters();
  }

  SeachByStatus(status: string) {
    this.seachByStatus = status;
    this.pageNumber = 1;
    this.GetWellDetailsWithFilters();
  }

  GetRandomNumbers(isNegative: boolean = true) {
    var integers = [];
    for (let index = 0; index < 7; index++) {
      integers.push([index + 1, (Math.random() * (isNegative ? 21 : 10)) - (isNegative ? 10 : 0)])
    }
    return integers;
  }

  prepareChart(x: WellModel): void {
    x.inferredChartObj = {
      title: { text: '' },
      chart: {
        renderTo: 'container',
        margin: 0,
        spacing: [0,0,0,0],
        backgroundColor: undefined
      },
      yAxis: {
        labels: {
          enabled: false
        },
        tickAmount: 6,
        gridLineWidth: 1
      },
      xAxis: {
        labels: {
          enabled: false
        },
        tickAmount: 6,
        gridLineWidth: 1
      },
      legend: {
        enabled: false
      },
      tooltip: {
        outside: true,
        className: 'highchart-elevate-tooltip'
      },
      series: [{
        type: 'line',
        data: this.GetRandomNumbers(false)
      }]
    }
  }

  navigateToWellInfo(wellId: string) {
    this.router.navigateByUrl(`/well-info/${wellId}`)
  }

}
