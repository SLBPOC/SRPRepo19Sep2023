import { Component,OnInit,AfterViewInit } from '@angular/core';
import { EventEmitter, Input, Output, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DateRange } from '@angular/material/datepicker';
import { MatTableDataSource } from '@angular/material/table';
import * as Highcharts from 'highcharts';
import { AlgorithmsAndMitigationsService } from '../../../services/algorithms-and-mitigations.service';
import { DynacardService } from '../../../services/dynacard.service';
import { BehaviorSubject, Observable, Subject, Subscription, map, of, switchMap, takeUntil, tap } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { CardDetailsModel, DynacardModel2 } from '../../../model/dyna-card.model';


// interface Food {
//     value: string;
//     viewValue: string;
//   }
//   export interface PeriodicElement {
//     select: string;
//     card: string;
//     time: string;
//     Minimum_Polished_Rod_Load: string;
//     Peak_Polished_Rod: string;
//   }
  // const ELEMENT_DATA: PeriodicElement[] = [
  //   { select: '', card: 'Pump Tagging', time: '2020-04-14 13:14:59', Minimum_Polished_Rod_Load: '17,829 lbs', Peak_Polished_Rod:'30,314 lbs' },
  //   { select: '', card: 'Pump Tagging', time: '2020-04-14 13:14:59', Minimum_Polished_Rod_Load: '17,829 lbs', Peak_Polished_Rod:'30,314 lbs' },
  //   { select: '', card: 'Pump Tagging', time: '2020-04-14 13:14:59', Minimum_Polished_Rod_Load: '17,829 lbs', Peak_Polished_Rod:'30,314 lbs' },
  //   { select: '', card: 'Pump Tagging', time: '2020-04-14 13:14:59', Minimum_Polished_Rod_Load: '17,829 lbs', Peak_Polished_Rod:'30,314 lbs' },
  //   { select: '', card: 'Pump Tagging', time: '2020-04-14 13:14:59', Minimum_Polished_Rod_Load: '17,829 lbs', Peak_Polished_Rod:'30,314 lbs' },
  //   { select: '', card: 'Pump Tagging', time: '2020-04-14 13:14:59', Minimum_Polished_Rod_Load: '17,829 lbs', Peak_Polished_Rod:'30,314 lbs' },
  //   { select: '', card: 'Pump Tagging', time: '2020-04-14 13:14:59', Minimum_Polished_Rod_Load: '17,829 lbs', Peak_Polished_Rod:'30,314 lbs' },
  //   { select: '', card: 'Pump Tagging', time: '2020-04-14 13:14:59', Minimum_Polished_Rod_Load: '17,829 lbs', Peak_Polished_Rod:'30,314 lbs' },
  // ];
@Component({
  selector: 'app-wellinfo-dynacard',
  templateUrl: './wellinfo-dynacard.component.html',
  styleUrls: ['./wellinfo-dynacard.component.scss'],
  
 
})

export class WellinfoDynacardComponent implements OnInit {
  // displayedColumns: string[] = ['select', 'card', 'time', 'Minimum_Polished_Rod_Load','Peak_Polished_Rod'];
  // dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  // foods: Food[] = [
  //   {value: 'steak-0', viewValue: 'Steak'},
  //   {value: 'pizza-1', viewValue: 'Pizza'},
  //   {value: 'tacos-2', viewValue: 'Tacos'},
  // ];

  dynacardSummaryData: {label: string, value: string}[] = [
    {label: 'Puming Status ', value: 'Running'},
    {label: 'Comm Status', value: 'Comm Established'},
    {label: 'Data Quality', value: 'ShutDown'},
    {label: 'Pump Card Diagnistics', value: 'Normal'},
    {label: 'Pump Displacement', value: '278.0 bbls/day'},
    // {label: 'Data Quality', value: 'ShutDown'},

   
  ]; 

  ///////////////////////////////////////////////
  // toppings = this._formBuilder.group({
  //   EffectiveRunTime: false,
  //   CyclesToday: false,
  //   StructuralLoad: false,
  //   MinMaxLoad: false,
  //   GearboxLoad: false,
  //   RodStress: false
  // });
  constructor(private _formBuilder: FormBuilder,private service: AlgorithmsAndMitigationsService,private dynaService:DynacardService) {
    this.dynaService.selectedClassification.subscribe(
      (x) => {
        this.selectedClassification.next(x);
        this.dynaService.selectedTime.next({addedOrRemoved:false,selected:'all'});
        this.selectionTimeModel.clear();
        this.searchText = '';
        this.searchTextObseravale.next('');
        // console.log(this.selectedClassification)
      }
    );

    this.dynaService.selectedTime.subscribe(x => {
      if (x.addedOrRemoved) {
        this.dynaService.getDetailsAboutTime(x.selected).subscribe(y => {
          this.selectedTimeDetails = y;
        });
      }
      else {
        this.selectedTimeDetails = new CardDetailsModel();
      }
    });

    this.dynaService.selectedTimeInGraph.subscribe(x => {
      if (x != undefined && x != '')
        this.dynaService.getDetailsAboutTime(x).subscribe(y => {
          this.selectedTimeDetails = y;
        });
    })
  }
  // ngAfterViewInit(): void {
  
  // }

  // BAR CHART
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {
    title: {
      text: ''
    },
    chart: {
      plotShadow: true,
      renderTo: 'container',
      backgroundColor:undefined
    },

    xAxis: {
      categories: ['Runtime(%) 23-06-20', 'Inferred Production(bpd) 23-06-21'],
      // labels:{
      //   enabled:false
      // }
      labels:{
        style:{
          fontSize:'9px'
        }
      }
    },

    yAxis: {
      // allowDecimals: false,
      // min: 100,
      labels:{
        enabled:false
      },
      title:{
        text:''
      },
      tickLength:0,
      gridLineWidth:0
    },
    legend:{
      enabled:false,
    },

    tooltip: {
      enabled:false,
      // headerFormat: '<b>{point.x}</b><br/>', pointFormat:

      //   '{series.name}:</b> Total: {point.stackTotal}',
    },

    plotOptions: {
      // column: {
      //   stacking: 'normal',
      //   allowPointSelect: true,
      // },
    },

    series: [

      {
        name: "",
        data: [30, 60],
        type: 'column',
        color: '#3097A7',
        pointWidth: 40,
        dataLabels:{
          enabled:true,
          inside:false,
          style:{
            fontSize:'9px'
          }
        }
      },
      // {
      //   name: "",
      //   data: [78, 68],
      //   type: 'column',
      //   color: '#3097A7',
      //   pointWidth: 40
      // },

    ],
  };
  // BAR CHART

  /// top bubble chart and legends
  
  bubbleSeries = [];
  bubbleChartInfo!: any;
  bubbleChartSubscription!: Subscription;
  bubbleChartInfoSubscription!: Subscription;

  // constructor() { }
  ngOnInit(): void {
    this.getChartData();
    this.getChartInfo();
    this.listOfTime = this.dynaService.getListOfTime()
    .pipe(
      switchMap(x=> this.selectedClassification.pipe(map(
        v => {
          var result = x != undefined && v > 0 ? x.filter((t, i) => (i+1) % (v % 8)) : [];
          return result;
        }
      )
      )),
      switchMap(x=> this.searchTextObseravale.pipe(map(
        text=> {
          if(text != "" && text != undefined)
          {
            return x.filter(t=>t.toLocaleLowerCase().trim().indexOf(text) > -1 );
          }
          return x;
        }
      )))
    );

    this.dynaService.selectedTime.pipe(takeUntil(this.$takUntil), switchMap(obj => {
      if (obj.addedOrRemoved) {
        return this.dynaService.getDynaCardDetailsForATime(obj.selected)
          .pipe(
            takeUntil(this.$takUntil),
            map(y => ({ dynaDetails: y, name: obj.selected })));
      }
      else {
        return of(({ dynaDetails: undefined, name: obj.selected }));
      }
    })).subscribe(x => {
      if (x.name == 'all')
        this.removeAllSeries();
      else
        this.updateInHighChartv2(x.dynaDetails, x.dynaDetails != undefined, x.name);
    });
  }

  getChartData(): void {
    this.bubbleChartSubscription = this.service.getBubbleChartData().subscribe((data: any) => {
      this.bubbleChartOptions.series = data;
      this.bubbleChartUpdate = true;
    })
  }

  getChartInfo() {
    this.bubbleChartInfoSubscription = this.service.getChartInfo().subscribe((data: any) => {
      this.bubbleChartInfo = data;
    })
  }

  onPointClick : Highcharts.PointClickCallbackFunction = (p)=> {
    this.dynaService.selectedClassification.next(p.point.options.z);
    // console.log(p.point.options.z)
  }

  onShowEvent = (p) =>{
    console.log(p);
  }

  bubbleChartUpdate : boolean = false;
  bubbleChartOptions : Highcharts.Options = {
    chart: {
      type: 'bubble',
      // plotBorderWidth: 1,
      spacing:[0,0,0,0],
      zooming: {
        type: 'x'
      },
      backgroundColor: undefined
    },
    // colorAxis: [{}, {
    //   minColor: '#434348',
    //   maxColor: '#e6ebf5'
    // }],
    title: {
      text: ''
    },
    xAxis: {
      gridLineWidth: 0,
      type:'category'
    },
    yAxis: {
      startOnTick: false,
      endOnTick: false,
      visible: false,
      // gridLineWidth: 1
    },
    legend: {
      enabled: false,
    },
    tooltip: {
      useHTML: true,
      pointFormat: '<b>{point.name}:</b> {point.value}'
    },
    plotOptions: {
      bubble: {
        minSize: '10%',
        maxSize: '12%',
        marker:{
          fillOpacity:1,
        },
        // zMin: 0,
        // zMax: 1000,
        // layoutAlgorithm: {
        //   splitSeries: false,
        //   gravitationalConstant: 0.02
        // },
        dataLabels: {
          enabled: true,
          format: `<b style="color:black">{point.z}</b>`,
          inside:true,
          style:{
           textOutline:'none'
          }
        },
        point:{
          events:{
            click: this.onPointClick
          }
        },
        events:{
          afterAnimate : this.onShowEvent,
          show:this.onShowEvent
        },
        cursor:'pointer',
        states: {
          hover: {
            enabled: false
          }
          ,inactive:{
            enabled:false
          }
        }
      }
    },
    series: this.bubbleSeries
  };
  
  // drawChart() {
  //   // // this.bubbleChartOptions.series.push(this.bubbleSeries);
  //   console.log(this.bubbleSeries);
    
  // }
  //top bubble chart and legends


  /// right time series table
  displayedColumns: string[] = ['#', 'card', 'time', 'minimunpolishedrodload', 'peakpolishedrod'];
  listOfTime: Observable<string[]>;
  selectedClassification = new BehaviorSubject<number>(-1);
  selectionTimeModel = new SelectionModel<string>(true);
  searchText:string;
  searchTextObseravale = new BehaviorSubject<string>("");

  tableLoading = false;
  
  searchTime(){
    this.searchTextObseravale.next(this.searchText);
  }

  randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }


  selectTime(item: string) {
    this.selectionTimeModel.toggle(item);
    this.dynaService.selectedTime.next({
      addedOrRemoved: this.selectionTimeModel.isSelected(item),
      selected: item
    })
  }

  /// right time series table

  ///dynacard graph

  $takUntil = new Subject<boolean>();

  ngOnDestroy(): void {
    this.$takUntil.next(true);
    this.$takUntil.complete();
  }
  onDynaPointClick = (p)=> {
    // console.log(p.point.series.name);
    this.dynaService.selectedTimeInGraph.next(p.point.series.name);
    // console.log(p.point.options.z)
  }



  // csvFile: any;
  // private csvText: string = "";
  // allData: DynaCardModel[] | null = null;
  Index: number = 0;

  updateDynaHighChartFlag: boolean = false;
  dynaOptions: Highcharts.Options = {
    chart: {
      renderTo: 'container',
      backgroundColor: undefined
    },
    legend: {

    },
    title: {
      text: ''
    },
    yAxis: {
      title: {
        text: 'Load'
      }
    },
    xAxis: {
      title: {
        text: 'Position'
      },
      type: 'category',
      tickInterval: 10
    },
    plotOptions:{
      series:{
        events:{
          click:this.onDynaPointClick
        },
        point:{
          events:{
            click:this.onDynaPointClick
          }
        }
      }
    },
    series: []
  };

  // updateChart(event: any) {
  //   this.updateCsvData(event);
  // }

  removeAllSeries() {
    this.dynaOptions.series.splice(0, this.dynaOptions.series.length);
    this.updateDynaHighChartFlag = true;
  }

  updateInHighChartv2(dynacard: DynacardModel2[], addedOrRemoved: boolean, name: string) {
    console.log(dynacard, addedOrRemoved);
    // return;
    if (addedOrRemoved) {
      var downhole = dynacard.map(x => [x.downhole_Card_Position, x.downhole_Card_Load]);
      var surface = dynacard.map(x => [x.surface_Card_Position, x.surface_Card_Load]);
      this.dynaOptions.series.push({
        id: name + '-downhole',
        type: 'line',
        data: downhole,
        colorIndex: this.Index,
        name: name
      });
      this.dynaOptions.series.push({
        id: name + '-surface',
        type: 'line',
        data: surface,
        colorIndex: this.Index,
        linkedTo: ':previous',
        name: name
      });
      this.Index++;
    }
    else {
      this.dynaOptions.series.filter(
        x => x.id == name + '-downhole' || x.id == name + '-surface'
      ).forEach(
        x => {
          var id = this.dynaOptions.series.findIndex(y => y.id == x.id);
          this.dynaOptions.series.splice(id, 1);
        });
    }
    this.updateDynaHighChartFlag = true;
  }

  ///dynacard graph

  ///Seleed Time series
  
  selectedTimeDetails: CardDetailsModel = new CardDetailsModel();;

  mappingOfFields = {
    pumpFillage_per: 'Pump Fillage(%) ',
    SPM: 'SPM',
    minPolishedRodLoad_lbs: 'Min.Polished Rod Load(lbs)',
    peakPolishedRodLoad_lbs: 'Peak Polished Rod Load(lbs)',
    surfaceStrokeLength_in: 'Surface Stroke Length (in)',
    downholeStrokeLength_in: 'Downhole Stroke Length (in)',
    totalFluid_in: 'Total Fluid (in)',
  };

  classficationListdata: { value , viewValue }[] = [
    { value: 1, viewValue: 'Pump Tagging' },
    { value: 2, viewValue: 'Last Storke Card' },
    { value: 3, viewValue: 'Distorted' },
    { value: 4, viewValue: 'Flatlining' },
    { value: 5, viewValue: 'Fluid Pound' },
    { value: 6, viewValue: 'Gas Interference' },
    { value: 7, viewValue: 'High Fluid Level' },
    { value: 8, viewValue: 'Very High Fluid Level' },
    { value: 9, viewValue: 'Other' },
  ];
  ///selected Time Series
}
