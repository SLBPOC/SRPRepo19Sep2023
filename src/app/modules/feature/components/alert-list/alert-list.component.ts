import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DateRange } from '@angular/material/datepicker';
import { AlertListService } from '../../services/alert-list.service';
import { AlertList } from '../../model/alert-list';
import { MatSort } from '@angular/material/sort';
import { FormGroup, FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Router ,ActivatedRoute} from '@angular/router';
import { WellModel } from '../../model/wellModel';
import { WellsService } from '../../services/wells.service';

interface Option {
  id: string;
  value: string;
}

enum DateRanges {
  DAY = 1,
  WEEK = 2,
  MONTH = 3,
}

@Component({
  selector: 'app-alert-list',
  templateUrl: './alert-list.component.html',
  styleUrls: ['./alert-list.component.scss']
})
export class AlertListComponent {
  wellList!: AlertList[];
  dataSource: any;
  displayedColumns: string[] = ["stat", "wellName", "alertLevel", "date", "desc", "status", "action"]
  alertTypes: Option[] = [
    { id: '1', value: 'High' },
    { id: '2', value: 'Medium' },
    { id: '3', value: 'Low' }
  ];
  statuses: Option[] = [
    { id: '1', value: 'Completed' },
    { id: '2', value: 'In Progress' }
  ];
  highCount = 0;
  medCount = 0;
  lowCount = 0;
  selectedStatus: any;
  selectedAlert: any;
  daysSelected: any[] = [];
  event: any;
  todayDate: Date = new Date();
  pipe!: DatePipe;
  searchText:string='';
  pageNumber = 1;
  pageSize: number = 5;
  model: any = {};
  seachByStatus: string = "";
  loading = true;
  WellList!: WellModel[];
  currentPage = 0;


  @Input() selectedRangeValue: DateRange<Date>;
  @Output() selectedRangeValueChange = new EventEmitter<DateRange<Date>>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private service: AlertListService, private wellService: WellsService, private router: Router,private _route:ActivatedRoute) { }

  ngOnInit() {

    this._route.params.subscribe(params => {
      this.searchText = params['id']     
    });
    
    let dte = new Date();
    dte.setDate(dte.getDate() - 1);
    this.service.getWellAlerts().subscribe((resp) => {
      this.wellList = resp;      
      this.dataSource = new MatTableDataSource<AlertList>(this.wellList);
      this.getLegendCount();
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      if(this.searchText !="")
      this.dataSource.filter = this.searchText;
    })
  }

  getLegendCount(){
    let high = this.wellList.filter(alert => alert.alertLevel == "High");
    this.highCount = high.length;

    let med = this.wellList.filter(alert => alert.alertLevel == "Medium");
    this.medCount = med.length;

    let low = this.wellList.filter(alert => alert.alertLevel == "Low");
    this.lowCount = low.length;
  }

  // search(data: Event) {
  //   const val = (data.target as HTMLInputElement).value;
  //   this.dataSource.filter = val;

  // }

  search() {   
    this.dataSource = new MatTableDataSource<AlertList>([...this.wellList]);
    this.dataSource.filter = this.searchText;
  }

  ClearSearch() {   
    this.searchText = "";
    this.service.getWellAlerts().subscribe((resp) => {
      this.wellList = resp;      
      this.dataSource = new MatTableDataSource<AlertList>(this.wellList);
      this.getLegendCount();
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;      
    })
  }

  alertChange(event: any) {
    let filterValue;
    filterValue = event.value.trim(); // Remove whitespace
    filterValue = event.value.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  statusChange(event: any) {
    let filterValue;
    filterValue = event.value.trim(); // Remove whitespace
    filterValue = event.value.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  applyFilter(){
    // this.dataSource.filteredData.filter((data: any) => data.status == this.selectedStatus && data.alertLevel == this.selectedAlert)
    // this.dataSource.filteredData = (data: any) => {
    //   if (this.selectedStatus && this.selectedAlert) {
    //     return data.status == this.selectedStatus && data.alertLevel == this.selectedAlert;
    //   }
    //   return true;
    // }

    // this.dataSource.filterPredicate = (data: any) => {
    //   if (this.selectedStatus && this.selectedAlert) {
    //     return data.status == this.selectedStatus && data.alertLevel == this.selectedAlert;
    //   }
    //   return true;
    // }

    // this.loading = true;
    let data = [...this.wellList].filter((data: any) => data.status == this.selectedStatus && data.alertLevel == this.selectedAlert)
    this.dataSource = data;

  }

  refreshFilter() {
    this.dataSource = [...this.wellList]
  }

  setDateSelected(option: any) {
    this.resetDateRangeFilters();
    switch (option) {
      case DateRanges.DAY:
        let today = (new Date()).toISOString();
        const filterValue = today.substring(0,10);
        this.dataSource.filter = filterValue.trim().toLowerCase();
        // let previous = new Date();
        // previous.setDate(previous.getDate() - 1);
        // let yes = previous.toISOString();
        // this.dataSource.filterPredicate = (data: any) => {
        //   if (today) {
        //     return (data.date).toString() == today;
        //   }
        //   return true;
        // }
        // this.dataSource.filter = '' + Math.random();
        break;

      case DateRanges.WEEK:
        let curr = new Date(); // get current date
        let first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
        let last = first + 6; // last day is the first day + 6
        let firstday = (new Date(curr.setDate(first))).toISOString();
        let lastday = (new Date(curr.setDate(last))).toISOString();
        this.dataSource.filterPredicate = (data: any) => {
          if (firstday && lastday) {
            return data.date >= firstday && data.date <= lastday;
          }
          return true;
        }
        this.dataSource.filter = '' + Math.random();
        break;

      case DateRanges.MONTH:
        let date = new Date();
        let firstDay = (new Date(date.getFullYear(), date.getMonth(), 1)).toISOString();
        let lastDay = (new Date(date.getFullYear(), date.getMonth() + 1, 0)).toISOString();
        this.dataSource.filterPredicate = (data: any) => {
          if (firstDay && lastDay) {
            return data.date >= firstDay && data.date <= lastDay;
          }
          return true;
        }
        this.dataSource.filter = '' + Math.random();
        break;
    }

  }

  resetDateRangeFilters(){
    this.dataSource.filter = '';
    let todaysDate = new Date();
    this.selectedRangeValue = new DateRange<Date>(todaysDate, null);
    this.selectedRangeValueChange.emit(this.selectedRangeValue);
 }

  applyDateRangeFilter() {
    let fromDate = this.selectedRangeValue.start?.toISOString();
    let toDate = this.selectedRangeValue.end?.toISOString()
    this.dataSource.filterPredicate = (data: any) => {
      if (fromDate && toDate) {
        return data.date >= fromDate && data.date <= toDate;
      }
      return true;
    }
    this.dataSource.filter = '' + Math.random();
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

  navigateToWellList() {
    this.router.navigateByUrl("/wells")
  }

  SeachByStatus(status: string) {
    this.seachByStatus = status;
    this.pageNumber = 1;
    // this.GetWellDetailsWithFilters();
  }

  SearchByStatus(status: string) {
    this.GetWellDetailsWithFilters(status);
  }

  GetWellDetailsWithFiltersTest() {
    this.loading = true;
    var SearchModel = this.createModel();
    this.wellService.getWellDetailsWithFilters(SearchModel).subscribe(response => {
      if (response.hasOwnProperty('data')) {
        this.loading = false;
        this.WellList = response.data;
        this.WellList.forEach(x => this.prepareChart(x));
        this.dataSource = new MatTableDataSource<WellModel>(this.WellList);
        setTimeout(() => {
          this.paginator.pageIndex = this.currentPage;
          this.paginator.length = response.totalCount;
        });

        // this.TotalCount = response.totalCount;
        // this.OverPumping = response.totalOverpumping;
        // this.OptimalPumping = response.totalOptimalPumping;
        // this.UnderPumping = response.totalUnderpumping;
      }

    });
  }

  GetWellDetailsWithFilters(status) {
    this.loading = true;
    let data = [...this.wellList].filter((data: any) => data.alertLevel === status)
    this.dataSource = data;
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

    GetRandomNumbers(isNegative: boolean = true) {
      var integers = [];
      for (let index = 0; index < 7; index++) {
        integers.push([index + 1, (Math.random() * (isNegative ? 21 : 10)) - (isNegative ? 10 : 0)])
      }
      return integers;
    }

}
