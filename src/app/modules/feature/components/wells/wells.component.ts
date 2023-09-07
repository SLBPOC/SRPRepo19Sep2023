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
export class WellsComponent implements OnInit{
  theme = 'light';
  dataSource: any = [];
  WellList!: WellModel[];
  selectedColumn: string[] = [];
  displayedColumns: string[] = ['WellStatus', 'WellName', 'DateAndTime', 'CommStatus', 'ControllerStatus', 'SPM.value', 'PumpFillage.value', 'InferredProduction.value', 'NoOfAlerts'];
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
  
  minmaxChartData:any[]=[];  //min max chart data array
  pageSizeOption=[10,20,30]
  respdata: any
  // chartarray:any[]=[
  //   [1, 8.620679090895912],
  //   [2, 5.056747930070717],
  //   [3, 1.2472775679926662],
  //   [4, 1.5001091034103453],
  //   [5, 8.445513107538643],
  //   [6, 0.16486046100086638],
  //   [7, 3.370270180965287]]

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

  GetWellDetailsWithFilters() {    
    this.loading = true;
    var SearchModel = this.createModel();
    this.service.getWellDetailsWithFilters(SearchModel).subscribe(response => {
      if (response.hasOwnProperty('data')) {
        this.loading = false;
        this.pageSizeOption=[10, 15, 20, response.totalCount]
        // this.getPageSizeOptions();
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
        this.dataSource.paginator = this.paginator;
       
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

  GetMinMaxChartData(w:WellModel)
  {
    this.minmaxChartData=[];
    this.minmaxChartData.push({name:"min",data:w.minMaxLoad.min});
    this.minmaxChartData.push({name:"min",data:w.minMaxLoad.max});
    return this.minmaxChartData;
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

  prepareChart(x: WellModel): void {
    
    this.bindInferredChart(x);
    this.bindSPMChart(x);
    this.bindPumpFillageChart(x);
    this.bindEffectiveRunChart(x);
    this.bindCycleChart(x);
    this.bindStructuralLoadChart(x);
    this.bindMinMaxLoadChart(x);
    this.bindGearBoxLoadChart(x);
    this.bindRodStressChart(x);
  }


  bindSPMChart(x: WellModel)
  {
    x.spmChartObj = {
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
        gridLineWidth: 1,
        visible: false
      },
      xAxis: {
        labels: {
          enabled: false
        },
        tickAmount: 6,
        gridLineWidth: 1,
        visible: false
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
        data: x.spm.data   //this.GetRandomNumbers(false)
      }]
    }
  }

  bindPumpFillageChart(x: WellModel)
  {
    x.pumpFillageChartObj = {
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
        gridLineWidth: 1,
        visible: false
      },
      xAxis: {
        labels: {
          enabled: false
        },
        tickAmount: 6,
        gridLineWidth: 1,
        visible: false
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
        data: x.pumpFillage.data
      }]
    }
  }

  bindInferredChart(x: WellModel)
  {   
    x.inferredChartObj = {
      title: { text: '' },      
      chart: {
        renderTo: 'container',
        type:'line',
        margin: 0,
        spacing: [0,0,0,0],
        backgroundColor: undefined
      },
      yAxis: {
        labels: {
          enabled: false
        },
        tickAmount: 6,
        gridLineWidth: 1,
        visible: false

      },
      xAxis: {
        labels: {
          enabled: false
        },
        tickAmount: 6,
        gridLineWidth: 1,
        visible: false

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
        data: x.inferredProduction.data
      }]
    }
  }

  bindEffectiveRunChart(x: WellModel)
  {
    x.effectiveRunChartObj = {
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
        gridLineWidth: 1,
        visible: false
      },
      xAxis: {
        labels: {
          enabled: false
        },
        tickAmount: 6,
        gridLineWidth: 1,
        visible: false
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
        data: x.effectiveRunTime.data //this.GetChartData(x).effectiveRuntime.data
      }]
    }
    
  }

  bindCycleChart(x: WellModel)
  {
    x.cycleChartObj = {
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
        gridLineWidth: 1,
        visible: false

      },
      xAxis: {
        labels: {
          enabled: false
        },
        tickAmount: 6,
        gridLineWidth: 1,
        visible: false

      },
      legend: {
        enabled: false
      },
      tooltip: {
        outside: true,
        className: 'highchart-elevate-tooltip'
      },
      series: [{
        type: 'column',
        data: x.cyclesToday.data
      }]
    }
  }

  bindStructuralLoadChart(x: WellModel)
  {
    x.structuralLoadChartObj = {
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
        gridLineWidth: 1,
        visible: false

      },
      xAxis: {
        labels: {
          enabled: false
        },
        tickAmount: 6,
        gridLineWidth: 1,
        visible: false

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
        data:  x.structuralLoad.data
      }]
    }
  }

  bindMinMaxLoadChart(x: WellModel)
  {
    
    x.minMaxLoadChartObj = {
      title: { text: '' },
      chart: {
        renderTo: 'container',
        margin: 0,
        type: 'line',
        spacing: [0,0,0,0],
        backgroundColor: undefined
      },
      yAxis: {
        labels: {
          enabled: false
        },
        tickAmount: 6,
        gridLineWidth: 1,
        visible: false

      },
      xAxis: {
        labels: {
          enabled: false
        },
        tickAmount: 6,
        gridLineWidth: 1,
        visible: false

      },
      legend: {
        enabled: false
      },
      tooltip: {
        outside: true,
        className: 'highchart-elevate-tooltip'
      },
      
      series: this.GetMinMaxChartData(x)
    }
  }

  bindGearBoxLoadChart(x: WellModel)
  {
    x.gearBoxLoadChartObj = {
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
        gridLineWidth: 1,
        visible: false

      },
      xAxis: {
        labels: {
          enabled: false
        },
        tickAmount: 6,
        gridLineWidth: 1,
        visible: false

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
        data:  x.gearboxLoad.data
      }]
    }
  }

  bindRodStressChart(x: WellModel)
  {
    x.roadStressChartObj = {
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
        gridLineWidth: 1,
        visible: false

      },
      xAxis: {
        labels: {
          enabled: false
        },
        tickAmount: 6,
        gridLineWidth: 1,
        visible: false

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
        data:  x.rodStress.data
      }]
    }
  }

  navigateToWellInfo(wellId: string) {
    //this.router.navigateByUrl(`/well-info-v2/${wellId}`)
    this.router.navigate([]).then(result => {  window.open(`/well-info-v2/${wellId}`, '_blank'); });  // in new tab
  }

  refreshGrid(payload: any) {
    console.log('wells component')
    this.service.getWellDetailsWithFilters(payload).subscribe(response => {
      if (response.hasOwnProperty('data')) {
        this.loading = false;
        this.pageSizeOption=[10, 15, 20, response.totalCount]
        // this.getPageSizeOptions();
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
        this.dataSource.paginator = this.paginator;
       
      }

    });
  }
}
