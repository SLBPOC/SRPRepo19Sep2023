import { Component, OnInit, ViewChild, ElementRef, Input, EventEmitter, Output } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';
import { AlertList } from '../../model/alert-list'
import { AlertListService } from '../../services/alert-list.service';
import { fromEvent, map, debounceTime, distinctUntilChanged, tap } from 'rxjs'
import * as HighCharts from 'highcharts';
import { Router } from '@angular/router';
import { TreeViewService } from '../../services/tree-view.service';
import { NodeType } from '../../services/models';
import { DateRange } from '@angular/material/datepicker';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { CustomAlertComponent } from '../custom-alert/custom-alert.component';
import * as XLSX from 'xlsx';
import { DatePipe } from '@angular/common';

interface Food {
  value: string;
  viewValue: string;
}

enum DateRanges {
  DAY = 1,
  WEEK = 2,
  MONTH = 3,
}

@Component({
  selector: 'app-alerts-srp',
  templateUrl: './alerts-srp.component.html',
  styleUrls: ['./alerts-srp.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class AlertsSrpComponent implements OnInit {

  foods: Food[] = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'},
  ];

  @Input() selectedRangeValue: DateRange<Date> | undefined;
  @Output() selectedRangeValueChange = new EventEmitter<DateRange<Date>>();

  theme = 'light';
  dataSource: any = [];
  alertList!: AlertList[];
  snoozeByTime: number = 1;
  clearAlertsComments!: string;
  selectedColumn: string[] = [];
  displayedColumns: string[] = ['stat', 'wellName', 'date', 'category', 'desc', 'action'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild('searchQueryInput') searchInput: ElementRef<HTMLInputElement>;
  @ViewChild('TABLE', { static: false }) TABLE: ElementRef;

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
  wellNames: any[];
  startDate: any;
  endDate: any;

  //legend variables
  TotalCount: number = 0;
  High: number = 0;
  Medium: number = 0;
  Low: number = 0;
  Clear: number = 0;
  legendCount: any;

  barChartData: any;
  categoriesChartData: any;
  minmaxChartData: any[] = [];  //min max chart data array
  pageSizeOption = [10, 20, 30]
  ids: number[];
  respdata: any
  todayDate : Date = new Date();
  dateString:string

  constructor(private _liveAnnouncer: LiveAnnouncer, private service: AlertListService, private router: Router
    , public treeviewService: TreeViewService
    ,public customDialog: MatDialog
    ,private datePipe: DatePipe) { }


  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
    fromEvent<any>(this.searchInput.nativeElement, 'keyup').pipe(
      map(event => event.target.value),
      debounceTime(500),
      distinctUntilChanged(),
      tap(x => this.searchText = x)
    ).subscribe(x => {
      if (x != undefined && x.trim() != "") {
        this.GetAlertListWithFilters();
      }
    });
  }

  ngOnInit(): void {
    // this.GetAlertListWithFilters();
    this.treeviewService.selectedNodes.subscribe(x => {
      if (x != undefined && x.length > 0 && x.some(m => m.type == NodeType.Wells)) {
        this.ids = x.filter(m => m.type == NodeType.Wells).map(m => m.nodeId);
      }
      else
        this.ids = [];
      this.GetAlertListWithFilters();
    })
  }

  errorHandling() {
    this.loading = false;
    this.pageNumber = 1;
    this.seachByStatus = "";
    this.searchText = "";
    this.ids = [];
    this.TotalCount = 0;
    this.alertList = [];
    this.dataSource = new MatTableDataSource<AlertList>(this.alertList);
  }

  GetAlertListWithFilters() {
    this.loading = true; 
    var SearchModel = this.createModel();
    this.service.getAlertList(SearchModel).subscribe(response => {
        this.loading = false;
        this.pageSizeOption = [10, 15, 20, response.alertsLevelDto.totalCount]
        // this.getPageSizeOptions();
        this.alertList = response.alerts;
        this.legendCount = response.alertsLevelDto;
        this.refreshAlertCategory(response);
        // this.alertList.forEach(x => this.prepareChart(x));
        this.dataSource = new MatTableDataSource<AlertList>(this.alertList);
        setTimeout(() => {
          this.paginator.pageIndex = this.currentPage;
          this.paginator.length = response.alertsLevelDto.totalCount;
        });

        this.TotalCount = response.alertsLevelDto.totalCount;
        this.getLegendCount();
        // this.High = response.alertsLevelDto.totalHigh;
        // this.Medium = response.alertsLevelDto.totalMedium;
        // this.Low = response.alertsLevelDto.totalLow;
        // this.Clear = response.alertsLevelDto.totalCleared;
        this.dataSource.paginator = this.paginator;

      // }

    },
    (err) => {
      this.errorHandling();
    });
  }

  GetAlertListWithSortFilters(payload: any) {
    this.loading = true; 
    // var SearchModel = this.createModel();
    this.service.getAlertList(payload).subscribe(response => {
        this.loading = false;
        this.pageSizeOption = [10, 15, 20, response.alertsLevelDto.totalCount]
        this.alertList = response.alerts;
        this.legendCount = response.alertsLevelDto;
        this.refreshAlertCategory(response);
        this.dataSource = new MatTableDataSource<AlertList>(this.alertList);
        setTimeout(() => {
          this.paginator.pageIndex = this.currentPage;
          this.paginator.length = response.alertsLevelDto.totalCount;
        });
        this.TotalCount = response.alertsLevelDto.totalCount;
        this.getLegendCount();
        // this.High = response.alertsLevelDto.totalHigh;
        // this.Medium = response.alertsLevelDto.totalMedium;
        // this.Low = response.alertsLevelDto.totalLow;
        // this.Clear = response.alertsLevelDto.totalCleared;
        this.dataSource.paginator = this.paginator;
    },
    (err) => {
      this.errorHandling();
    });
  }

  refreshAlertCategory(response: any) {
  this.categoriesChartData = response.alertcategory;
  this.barChartData = response.alertcount;
  }

  filterAndSortAlerts(payload: any){
    this.GetAlertListWithSortFilters(payload);
  }

  getLegendCount() {
    let high = this.alertList.filter((alert) => alert.alertLevel == 'High');
    this.High = high.length;

    let med = this.alertList.filter((alert) => alert.alertLevel == 'Medium');
    this.Medium = med.length;

    let low = this.alertList.filter((alert) => alert.alertLevel == 'Low');
    this.Low = low.length;

    let clear = this.alertList.filter((alert) => alert.alertLevel == 'Cleared');
    this.Clear = clear.length;
  }

  //Create Model for search
  createModel(this: any) {
    let dateObj = {
      "fromDate": this.startDate ? this.startDate : "",
      "toDate": this.endDate ? this.endDate : ""
    }
    this.model.pageSize = this.pageSize;
    this.model.pageNumber = this.pageNumber;
    this.model.searchText = this.searchText ? this.searchText : "";
    this.model.sortColumn = this.sortColumn ? this.sortColumn : "";
    this.model.sortDirection = this.sortDirection ? this.sortDirection : "";
    this.model.searchStatus = this.seachByStatus ? this.seachByStatus : "";
    this.model.dateRange = dateObj;
    // this.model.wellNames = this.selectedWells ? this.selectedWells : [];
    // this.model.wellNames = this.selectedCategory ? this.selectedCategory : [];

    return this.model;
  }

  getWellTreeSearch(searchTxt: string){
    this.searchText = searchTxt;
    this.GetAlertListWithFilters();
  }

  ClearSearch() {
    this.pageNumber = 1;
    this.seachByStatus = "";
    this.searchText = "";
    this.ids = [];
    this.GetAlertListWithFilters();
  }

  RefreshGrid() {
    this.searchText = "";
    const payload = {
      "pageSize": 5,
      "pageNumber": 1,
      "searchText": "",
      "sortColumn": "",
      "sortDirection": "",
      "searchStatus": ""
    }

    this.service.getAlertList(payload).subscribe((response: any) => {
        this.loading = false;
        this.pageSizeOption = [10, 15, 20, response.totalCount]
        this.alertList = response.alerts;
        this.refreshAlertCategory(response);
        this.dataSource = new MatTableDataSource<AlertList>(this.alertList);
        setTimeout(() => {
          this.paginator.length = response.alertsLevelDto.totalCount;
        });

        this.TotalCount = response.alertsLevelDto.totalCount;
        this.getLegendCount();
        this.dataSource.paginator = this.paginator;

    },
    (err) => {
      this.errorHandling();
    })
  }

  legendFilter(priority: any) {
    // this.searchText = priority
    // this.GetAlertListWithFilters();
    let priorityList: AlertList[];
    switch (priority) {
      case 'High':
        priorityList = this.alertList.filter(
          (alert) => alert.alertLevel === 'High'
        );
        this.dataSource = new MatTableDataSource<AlertList>(priorityList);
        break;
      case 'Medium':
        priorityList = this.alertList.filter(
          (alert) => alert.alertLevel === 'Medium'
        );
        this.dataSource = new MatTableDataSource<AlertList>(priorityList);
        break;
      case 'Low':
        priorityList = this.alertList.filter(
          (alert) => alert.alertLevel === 'Low'
        );
        this.dataSource = new MatTableDataSource<AlertList>(priorityList);
        break;
      case 'Cleared':
        priorityList = this.alertList.filter(
          (alert) => alert.alertLevel === 'Cleared'
        );
        this.dataSource = new MatTableDataSource<AlertList>(priorityList);
        break;
    }
  }

  filterGridByCategory(category: any) {
    let categoryList: AlertList[];
    categoryList = this.alertList.filter(
      (alert) => alert.category === category
    );
    this.dataSource = new MatTableDataSource<AlertList>(categoryList);
  }

  snoozeBy(snoozeTime: any, snoozeByTime: number) {
    this.service.snoozeBy(snoozeTime.alertId, snoozeByTime).subscribe((data: any) => {
        this.GetAlertListWithFilters();
      });
  }

  clearAlerts(alert: any, comment: string) {
    this.loading = true;
    this.service.clearAlert(alert.alertId, comment).subscribe((data: any) => {
      this.clearAlertsComments = '';
      if (data.success == true) {
        this.GetAlertListWithFilters();
        this.loading = false;
        // this.isDisable = true;
        // this.SnoozeFlag = true;
      }
    });
  }

  resetDateFilters() {
    // this.dataSource.filter = '';
    this.pageNumber = this.pageNumber;
    this.seachByStatus = '';
    this.searchText = '';
    let todaysDate = new Date();
    this.selectedRangeValue = new DateRange<Date>(todaysDate, null);
    this.selectedRangeValueChange.emit(this.selectedRangeValue);
  }

  setDateSelected(option: any) {
    this.resetDateFilters();
    switch (option) {
      case DateRanges.DAY:
        let today = new Date().toISOString();
        let d = new Date();
        let tomorrow = new Date();
        tomorrow.setDate(d.getDate() + 1);
        let tomorrowStr = tomorrow.toISOString();
        this.startDate = today.substring(0, 10);
        this.endDate = tomorrowStr.substring(0, 10);
        this.GetAlertListWithFilters();
        break;

      case DateRanges.WEEK:
        let curr = new Date(); // get current date
        let first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
        let last = first + 6; // last day is the first day + 6
        let firstday = new Date(curr.setDate(first)).toISOString();
        let lastday = new Date(curr.setDate(last)).toISOString();
        this.startDate = firstday.substring(0, 10);
        this.endDate = lastday.substring(0, 10);
        this.GetAlertListWithFilters();
        break;

      case DateRanges.MONTH:
        let date = new Date();
        let firstDay = new Date(
          date.getFullYear(),
          date.getMonth(),
          1
        ).toISOString();
        let lastDay = new Date(
          date.getFullYear(),
          date.getMonth() + 1,
          0
        ).toISOString();
        this.startDate = firstDay.substring(0, 10);
        this.endDate = lastDay.substring(0, 10);
        this.GetAlertListWithFilters();
    }
  }

  resetDateRangeFilters() {
    // this.dataSource.filter = '';
    this.startDate = "";
    this.endDate = "";
    this.RefreshGrid();
    let todaysDate = new Date();
    this.selectedRangeValue = new DateRange<Date>(todaysDate, null);
    this.selectedRangeValueChange.emit(this.selectedRangeValue);
  }

  getSelectedMonth(month: any) {
    let m = month + 1;
    return m.toString().padStart(2, '0');
  }

  getSelectedDay(day: any) {
    return day.toString().padStart(2, '0');
  }

  applyDateRangeFilter() {
    let fromDate = this.selectedRangeValue.start;
    let toDate = this.selectedRangeValue.end;
    let startDate =
      fromDate?.getFullYear() +
      '-' +
      this.getSelectedMonth(fromDate?.getMonth()) +
      '-' +
      this.getSelectedDay(fromDate?.getDate());
    let endDate =
      toDate?.getFullYear() +
      '-' +
      this.getSelectedMonth(toDate?.getMonth()) +
      '-' +
      this.getSelectedDay(toDate?.getDate());
    this.startDate = startDate
    this.endDate = endDate
    this.GetAlertListWithFilters();
  }

  selectedChange(m: any) {
    if (!this.selectedRangeValue?.start || this.selectedRangeValue?.end) {
        this.selectedRangeValue = new DateRange<Date>(m, null);
    } else {
        const start = this.selectedRangeValue.start;
        const end = m;
        if (end < start) {
            this.selectedRangeValue = new DateRange<Date>(end, start);
        } else {
            this.selectedRangeValue = new DateRange<Date>(start, end);
        }
    }
    this.selectedRangeValueChange.emit(this.selectedRangeValue);
}

  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.pageNumber = event.pageIndex + 1;
    this.GetAlertListWithFilters();
  }

  public onSortChanged(e: any) {
    this.pageNumber = this.pageNumber;
    this.pageSize = this.pageSize;
    this.sortDirection = this.sort.direction;
    this.sortColumn = (typeof this.sort.active !== "undefined") ? this.sort.active : "";
    this.GetAlertListWithFilters();
  }

  SeachByStatus(status: string) {
    this.seachByStatus = status;
    this.pageNumber = 1;
    this.GetAlertListWithFilters();
  }

  openDialog() {
    this.customDialog.open(CustomAlertComponent);
  }

  searchObjC: any;
  userSearchChange(obj: any) {
    this.searchObjC = obj;
  }
  createModelReport(this: any) {
    debugger;
    this.model.pageSize = this.TotalCount;
    this.model.pageNumber = 1;
    this.model.searchText = this.searchText ? this.searchText : "";
    this.model.sortColumn = this.sortColumn ? this.sortColumn : "";
    this.model.sortDirection = this.sortDirection ? this.sortDirection : "";
    this.model.searchStatus = this.seachByStatus ? this.seachByStatus : "";

    return this.model;
  }
  AlertsDownloadExcel() {
    debugger;
    this.loading = true;
    var payload = this.createModelReport();
    this.service.getAlertListFilters(payload).subscribe(response => {
      this.dataSource = new MatTableDataSource<AlertList>(this.alertList);
     this.exportToXls(this.dataSource);
      })
  }
  exportToXls(list:any){
    debugger;
    this.dateString = this.datePipe.transform(this.todayDate, 'dd_MM_YYYY_hh_mm');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.TABLE.nativeElement); 
    const wb: XLSX.WorkBook = XLSX.utils.book_new(); 
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1'); 
    XLSX.writeFile(wb, 'AlertList_'+this.dateString +'.xlsx');
  }
}
