import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Output,
  Renderer2,
  ElementRef,
  ViewChild,
} from '@angular/core';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
  DateRange,
  MatCalendar,
  MatCalendarCellClassFunction,
  MatDatepicker,
} from '@angular/material/datepicker';
import { FormBuilder } from '@angular/forms';
import { EventList } from '../../model/event-list';
import { EventListService } from '../../services/event-list.service';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { ThemePalette } from '@angular/material/core';
import { FormGroup, FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { SLBSearchParams, SortOptions } from 'src/app/models/slb-params';
import { ViewEncapsulation } from '@angular/compiler';
import { WellsService } from '../../services/wells.service';
import { WellModel } from '../../model/wellModel';
import { NodeType } from '../../services/models';
import { debounceTime, distinctUntilChanged, fromEvent, map, tap } from 'rxjs';
import { TreeViewService } from '../../services/tree-view.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';

interface Food {
  value: string;
  viewValue: string;
}
class EventFormModel {
  searchQueryInput: string;
  dateRange: DateRangeProps;
  eventType: number;
  status: number;
  constructor() {
    this.dateRange = new DateRangeProps();
  }
}
class DateRangeProps {
  start: Date;
  end: Date;
}
enum DateRanges {
  DAY = 1,
  WEEK = 2,
  MONTH = 3,
}

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss'],
})
export class EventListComponent {
  foods: Food[] = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'tacos-2', viewValue: 'Tacos' },
  ];

  @Input() selectedRangeValue: DateRange<Date> | undefined;
  @Output() selectedRangeValueChange = new EventEmitter<DateRange<Date>>();

  theme = 'light';
  dataSource: any = [];
  eventList!: EventList[];
  snoozeByTime: number = 1;
  clearAlertsComments!: string;
  selectedColumn: string[] = [];
  displayedColumns: string[] = [
    // 'EventId',
    'WellName',
    'EventType',
    'CreationDateTime',
    // 'Category',
    'UpdatedBy',
    'EventDescription',
  ];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('searchQueryInput') searchInput: ElementRef<HTMLInputElement>;
  @ViewChild('TABLE', { static: false }) TABLE: ElementRef;
  searchText: string = '';
  sortDirection: string = '';
  sortColumn: string = '';
  pageSize: number = 10;
  pageNumber = 1;
  currentPage = 0;
  totalCount = 0;
  model: any = {};
  seachByStatus: string = '';
  loading = true;
  wellNames: any[];
  TotalCount: number = 0;
  High: number = 0;
  Medium: number = 0;
  Low: number = 0;
  Clear: number = 0;
  legendCount: any;

  categoriesChartData: any;
  minmaxChartData: any[] = []; //min max chart data array
  pageSizeOption = [5, 10, 20, 30];
  ids: number[];
  respdata: any;
  todayDate: Date = new Date();
  dateString: string;
  startDate: string;
  endDate: string;

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private service: EventListService,
    private router: Router,
    public treeviewService: TreeViewService,
    private datePipe: DatePipe
  ) {}

  ngAfterViewInit() {
    fromEvent<any>(this.searchInput.nativeElement, 'keyup')
      .pipe(
        map((event) => event.target.value),
        debounceTime(500),
        distinctUntilChanged(),
        tap((x) => (this.searchText = x))
      )
      .subscribe((x) => {
        if (x != undefined && x.trim() != '') {
          this.GetEventListWithFilters();
        }
      });
  }

  ngOnInit(): void {
    this.treeviewService.selectedNodes.subscribe((x) => {
      console.log(x);
      if (
        x != undefined &&
        x.length > 0 &&
        x.some((m) => m.type == NodeType.Wells)
      ) {
        this.ids = x
          .filter((m) => m.type == NodeType.Wells)
          .map((m) => m.nodeId);
      } else this.ids = [];
    });
    this.GetEventListWithFilters();
  }

  GetEventListWithFilters() {
    this.loading = true;
    var SearchModel = this.createModel();
    this.service.getEventList(SearchModel).subscribe(
      (response) => {
        this.loading = false;
        this.bindDataSource(response);
      },
      (error) => {
        this.loading = false;
        this.bindDataSource({ events: [], totalcount: 0 });
      }
    );
  }

  GetEventListWithSortFilters(payload: any) {
    this.loading = true;
    var SearchModel = this.createModel();
    // selectedWells: this.eventSelectedWells,
    // selectedCategory: this.providers.value,
    console.log(payload, 'payloaddddddddddddddddd');
    if (payload) {
      SearchModel.wellNames = payload.selectedWells
        ? payload.selectedWells
        : [];
      SearchModel.eventTypes = payload.eventType ? payload.eventType : [];
    }
    this.service.getEventList(SearchModel).subscribe(
      (response) => {
        this.loading = false;
        this.bindDataSource(response);
      },
      (error) => {
        this.loading = false;
        this.bindDataSource({ events: [], totalcount: 0 });
      }
    );
  }

  bindDataSource(response) {
    this.pageSizeOption = [10, 15, 20];
    this.eventList = response.events;
    this.dataSource = new MatTableDataSource<EventList>(this.eventList);
    setTimeout(() => {
      this.paginator.pageIndex = this.currentPage;
      this.paginator.length = response.totalcount;
    });
    this.TotalCount = response.totalcount;
    // this.Clear = response.alertsLevelDto.totalCleared;
    this.dataSource.paginator = this.paginator;
  }

  filterAndSortAlerts(payload: any) {
    console.log(payload, 'payloaddddddddddddd');

    this.GetEventListWithSortFilters(payload);
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
        this.GetEventListWithFilters();
        break;

      case DateRanges.WEEK:
        let curr = new Date(); // get current date
        let first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
        let last = first + 6; // last day is the first day + 6
        let firstday = new Date(curr.setDate(first)).toISOString();
        let lastday = new Date(curr.setDate(last)).toISOString();
        this.startDate = firstday.substring(0, 10);
        this.endDate = lastday.substring(0, 10);
        this.GetEventListWithFilters();
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
        this.GetEventListWithFilters();
    }
  }

  //Create Model for search
  createModel(this: any) {
    let dateObj = {
      fromDate: this.startDate ? this.startDate : '',
      toDate: this.endDate ? this.endDate : '',
    };
    this.model.pageSize = this.pageSize;
    this.model.pageNumber = this.pageNumber;
    this.model.searchText = this.searchText ? this.searchText : '';
    this.model.sortColumn = this.sortColumn ? this.sortColumn : '';
    this.model.sortDirection = this.sortDirection ? this.sortDirection : '';
    this.model.searchStatus = this.seachByStatus ? this.seachByStatus : '';
    this.model.dateRange = dateObj;
    this.model.wellNames = this.selectedWells ? this.selectedWells : [];
    this.model.eventTypes = this.selectedEventType
      ? this.selectedEventType
      : [];
    this.model.ids = this.ids ? this.ids : [];

    return this.model;
  }

  ClearSearch() {
    this.pageNumber = 1;
    this.seachByStatus = '';
    this.searchText = '';
    this.ids = [];
    (this.startDate = ''), (this.endDate = ''), this.GetEventListWithFilters();
  }

  RefreshGrid() {
    this.pageNumber = 1;
    this.seachByStatus = '';
    this.searchText = '';
    this.ids = [];
    (this.startDate = ''), (this.endDate = ''), this.GetEventListWithFilters();
    // this.GetEventListWithFilters();
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
    this.startDate = startDate;
    this.endDate = endDate;
    this.GetEventListWithFilters();
  }

  resetDateRangeFilters() {
    this.dataSource.filter = '';
    this.startDate = '';
    this.endDate = '';
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
    this.GetEventListWithFilters();
  }

  public onSortChanged(e: any) {
    this.pageNumber = this.pageNumber;
    this.pageSize = this.pageSize;
    this.sortDirection = this.sort.direction;
    this.sortColumn =
      typeof this.sort.active !== 'undefined' ? this.sort.active : '';
    this.GetEventListWithFilters();
  }

  SeachByStatus(status: string) {
    this.seachByStatus = status;
    this.pageNumber = 1;
    this.GetEventListWithFilters();
  }

  searchObjC: any;
  userSearchChange(obj: any) {
    this.searchObjC = obj;
  }
  createModelReport(this: any) {
    this.model.pageSize = this.TotalCount;
    this.model.pageNumber = 1;
    this.model.searchText = this.searchText ? this.searchText : '';
    this.model.sortColumn = this.sortColumn ? this.sortColumn : '';
    this.model.sortDirection = this.sortDirection ? this.sortDirection : '';
    this.model.searchStatus = this.seachByStatus ? this.seachByStatus : '';
    this.model.ids = this.ids;
    this.model.wellNames = this.wellNames ? this.wellNames : [];
    this.model.eventType = this.eventType ? this.eventType : [];
    return this.model;
  }

  getWellTreeSearch(searchTxt: string) {
    this.searchText = searchTxt;
    this.GetEventListWithFilters();
  }
  EventDownLoadReport() {
    this.loading = true;
    var SearchModel = this.createModelReport();
    this.service.getEventList(SearchModel).subscribe((respince) => {
      this.dataSource = new MatTableDataSource<EventList>(this.eventList);
      this.exportToXls(this.dataSource);
    });
  }
  exportToXls(list: any) {
    debugger;
    this.dateString = this.datePipe.transform(
      this.todayDate,
      'dd_MM_YYYY_hh_mm'
    );
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(
      this.TABLE.nativeElement
    );
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'EventList_' + this.dateString + '.xlsx');
  }
}
