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
    'No',
    'wellName',
    'EventType',
    'date',
    // 'Category',
    'UpdateBy',
    'desc',
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
  todayDate : Date = new Date();
  dateString:string

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
      this.GetEventListWithFilters();
    });
  }

  GetEventListWithFilters() {
    this.loading = true;
    var SearchModel = this.createModel();
    this.service.getEventList(SearchModel).subscribe((response) => {
      this.loading = false;
      this.pageSizeOption = [10, 15, 20];
      this.eventList = response.events;
      console.log(this.eventList);
      this.dataSource = new MatTableDataSource<EventList>(this.eventList);
      setTimeout(() => {
        this.paginator.pageIndex = this.currentPage;
        this.paginator.length = response.totalcount;
      });
      this.TotalCount = response.totalcount;
      this.dataSource.paginator = this.paginator;
    });
  }

  GetEventListWithSortFilters(SearchModel: any) {
    this.loading = true;
    var SearchModel = this.createModel();
    this.service.getEventList(SearchModel).subscribe((response) => {
      this.loading = false;
      this.pageSizeOption = [10, 15, 20, response.totalcount];
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
    this.GetEventListWithSortFilters(payload);
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
    this.GetEventListWithFilters();
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

    this.service.getEventList(payload).subscribe((response: any) => {
      this.loading = false;
      this.pageSizeOption = [10, 15, 20, response.totalCount];
      this.eventList = response.data;
      this.dataSource = new MatTableDataSource<EventList>(this.eventList);
      setTimeout(() => {
        this.paginator.length = response.totalcount;
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
    debugger;
    this.model.pageSize = this.TotalCount;
    this.model.pageNumber = 1;
    this.model.searchText = this.searchText ? this.searchText : "";
    this.model.sortColumn = this.sortColumn ? this.sortColumn : "";
    this.model.sortDirection = this.sortDirection ? this.sortDirection : "";
    this.model.searchStatus = this.seachByStatus ? this.seachByStatus : "";
    this.model.ids = this.ids;

    this.model.commStatus = this.commStatus ? this.commStatus : [];
    this.model.controllerStatus = this.controllerStatus ? this.controllerStatus : [];
    this.model.inferredProduction = this.inferredProduction ? this.inferredProduction : { start: 0, end: 100 };
    this.model.pumpFillage = this.pumpFillage ? this.pumpFillage : { start: 0, end: 100 };
    this.model.pumpingType = this.pumpingType ? this.pumpingType : [];
    this.model.spm = this.spm ? this.spm : { start: 0, end: 100 };
    this.model.wellNames = this.wellNames ? this.wellNames : [];
    return this.model;
  }
  EventDownLoadReport() {
    debugger;
    this.loading = true;
    var SearchModel = this.createModelReport();
    this.service.getEventList(SearchModel).subscribe(respince =>{
      this.dataSource = new MatTableDataSource<EventList>(this.eventList);
     this.exportToXls(this.dataSource);
      })
  }
  exportToXls(list:any){
    debugger;
    this.dateString = this.datePipe.transform(this.todayDate, 'dd_MM_YYYY_hh_mm');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.TABLE.nativeElement); 
    const wb: XLSX.WorkBook = XLSX.utils.book_new(); 
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1'); 
    XLSX.writeFile(wb, 'EventList_'+this.dateString +'.xlsx');
  }
}
