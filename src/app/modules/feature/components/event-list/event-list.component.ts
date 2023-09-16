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
    'No',
    'wellName',
    'EventType',
    'date',
    'Category',
    'UpdateBy',
    'desc',
  ];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild('searchQueryInput') searchInput: ElementRef<HTMLInputElement>;

  // HighCharts: typeof HighCharts = HighCharts;

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
  minmaxChartData: any[] = []; //min max chart data array
  pageSizeOption = [10, 20, 30];
  ids: number[];
  respdata: any;

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private service: EventListService,
    private router: Router,
    public treeviewService: TreeViewService
  ) {}

  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
    fromEvent<any>(this.searchInput.nativeElement, 'keyup')
      .pipe(
        map((event) => event.target.value),
        debounceTime(500),
        distinctUntilChanged(),
        tap((x) => (this.searchText = x))
      )
      .subscribe((x) => {
        if (x != undefined && x.trim() != '') {
          this.GetAlertListWithFilters();
        }
      });
  }

  ngOnInit(): void {
    // this.GetAlertListWithFilters();
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
      this.GetAlertListWithFilters();
    });
  }

  GetAlertListWithFilters() {
    this.loading = true;
    var SearchModel = this.createModel();
    this.service.getAlertList(SearchModel).subscribe((response) => {
      this.loading = false;
      // this.pageSizeOption = [10, 15, 20, response.eventsLevelDto.totalCount];
      // this.getPageSizeOptions();
      this.eventList = response.events;
      console.log(this.eventList);
      // this.legendCount = response.alertsLevelDto;
      // this.categoriesChartData = response.alertcategory;
      // this.alertList.forEach(x => this.prepareChart(x));
      this.dataSource = new MatTableDataSource<EventList>(this.eventList);
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

  GetAlertListWithSortFilters(SearchModel: any) {
    this.loading = true;
    var SearchModel = this.createModel();
    this.service.getAlertList(SearchModel).subscribe((response) => {
      this.loading = false;
      this.pageSizeOption = [10, 15, 20, response.alertsLevelDto.totalCount];
      this.eventList = response.alerts;
      this.legendCount = response.alertsLevelDto;
      this.dataSource = new MatTableDataSource<EventList>(this.eventList);
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

  filterAndSortAlerts(payload: any) {
    this.GetAlertListWithSortFilters(payload);
  }

  //Create Model for search
  createModel(this: any) {
    let dateObj = {
      fromDate: '',
      toDate: '',
    };
    this.model.pageSize = this.pageSize;
    this.model.pageNumber = this.pageNumber;
    this.model.searchText = this.searchText ? this.searchText : '';
    this.model.sortColumn = this.sortColumn ? this.sortColumn : '';
    this.model.sortDirection = this.sortDirection ? this.sortDirection : '';
    this.model.searchStatus = this.seachByStatus ? this.seachByStatus : '';
    this.model.dateRange = dateObj;
    this.model.wellNames = this.selectedWells ? this.selectedWells : [];
    this.model.category = this.selectedCategory ? this.selectedCategory : [];
    this.model.ids = this.ids ? this.ids : [];

    return this.model;
  }

  ClearSearch() {
    this.pageNumber = 1;
    this.seachByStatus = '';
    this.searchText = '';
    this.ids = [];
    this.GetAlertListWithFilters();
  }

  RefreshGrid() {
    const payload = {
      pageSize: 5,
      pageNumber: 1,
      searchText: '',
      sortColumn: '',
      sortDirection: '',
      searchStatus: '',
    };

    this.service.getAlertList(payload).subscribe((response: any) => {
      // if (response.hasOwnProperty('data')) {
      this.loading = false;
      this.pageSizeOption = [10, 15, 20, response.totalCount];
      // this.getPageSizeOptions();
      this.eventList = response.data;
      // this.alertList.forEach(x => this.prepareChart(x));
      this.dataSource = new MatTableDataSource<EventList>(this.eventList);
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
    });
  }

  snoozeBy(snoozeTime: any, snoozeByTime: number) {
    this.service
      .snoozeBy(snoozeTime.alertId, snoozeByTime)
      .subscribe((data: any) => {
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
    this.sortColumn =
      typeof this.sort.active !== 'undefined' ? this.sort.active : '';
    this.GetAlertListWithFilters();
  }

  SeachByStatus(status: string) {
    this.seachByStatus = status;
    this.pageNumber = 1;
    this.GetAlertListWithFilters();
  }

  searchObjC: any;
  userSearchChange(obj: any) {
    this.searchObjC = obj;
  }
}
