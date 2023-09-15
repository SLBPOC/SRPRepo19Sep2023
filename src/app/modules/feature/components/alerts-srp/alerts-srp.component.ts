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

interface Food {
  value: string;
  viewValue: string;
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
  displayedColumns: string[] = ['wellName', 'date', 'category', 'desc', 'action'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

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
  wellNames: any[];


  //legend variables
  TotalCount: number = 0;
  High: number = 0;
  Medium: number = 0;
  Low: number = 0;
  Clear: number = 0;
  legendCount: any;

  categoriesChartData: any;
  minmaxChartData: any[] = [];  //min max chart data array
  pageSizeOption = [10, 20, 30]
  ids: number[];
  respdata: any


  constructor(private _liveAnnouncer: LiveAnnouncer, private service: AlertListService, private router: Router
    , public treeviewService: TreeViewService
    ,public customDialog: MatDialog) { }


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
      console.log(x);
      if (x != undefined && x.length > 0 && x.some(m => m.type == NodeType.Wells)) {
        this.ids = x.filter(m => m.type == NodeType.Wells).map(m => m.nodeId);
      }
      else
        this.ids = [];
      this.GetAlertListWithFilters();
    })
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
        this.categoriesChartData = response.alertcategory;
        // this.alertList.forEach(x => this.prepareChart(x));
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

  GetAlertListWithSortFilters(payload: any) {
    this.loading = true; 
    // var SearchModel = this.createModel();
    this.service.getAlertList(payload).subscribe(response => {
        this.loading = false;
        this.pageSizeOption = [10, 15, 20, response.alertsLevelDto.totalCount]
        this.alertList = response.alerts;
        this.legendCount = response.alertsLevelDto;
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
    });
  }

  filterAndSortAlerts(payload: any){
    this.GetAlertListWithSortFilters(payload);
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
    this.model.dateRange = dateObj;
    // this.model.wellNames = this.selectedWells ? this.selectedWells : [];
    // this.model.wellNames = this.selectedCategory ? this.selectedCategory : [];

    return this.model;
  }

  ClearSearch() {
    this.pageNumber = 1;
    this.seachByStatus = "";
    this.searchText = "";
    this.ids = [];
    this.GetAlertListWithFilters();
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
        // this.alertList.forEach(x => this.prepareChart(x));
        this.dataSource = new MatTableDataSource<AlertList>(this.alertList);
        setTimeout(() => {
          // this.paginator.pageIndex = this.currentPage;
          this.paginator.length = response.totalCount;
        });

        this.TotalCount = response.alertsLevelDto.totalCount;
        this.High = response.alertsLevelDto.totalHigh;
        this.Medium = response.alertsLevelDto.totalMedium;
        this.Low = response.alertsLevelDto.totalLow;
        this.Clear = response.alertsLevelDto.totalCleared;
        this.dataSource.paginator = this.paginator;

      // }
    })
  }

  snoozeBy(snoozeTime: any, snoozeByTime: number) {
    this.service.snoozeBy(snoozeTime.alertId, snoozeByTime).subscribe((data: any) => {
        console.log('snooze by response', data);
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
    console.log({ event });
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

}
