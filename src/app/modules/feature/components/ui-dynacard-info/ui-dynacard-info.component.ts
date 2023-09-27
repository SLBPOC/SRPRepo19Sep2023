import { Component, OnInit, AfterViewInit } from '@angular/core';
import { EventEmitter, Input, Output, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { DateRange } from '@angular/material/datepicker';
import { MatTableDataSource } from '@angular/material/table';
import * as Highcharts from 'highcharts';
import { AlgorithmsAndMitigationsService } from '../../services/algorithms-and-mitigations.service';
import { DynacardService } from '../../services/dynacard.service';
import { BehaviorSubject, Observable, Subject, Subscription, map, of, switchMap, takeUntil, tap } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { CardDetailsModel, ClassficationInfo, Classification, DateRangeBubbleChart, DynacardModel2, FramesDynameter, DynaCardDetailsModel } from '../../model/dyna-card.model';

@Component({
  selector: 'app-ui-dynacard-info',
  templateUrl: './ui-dynacard-info.component.html',
  styleUrls: ['./ui-dynacard-info.component.scss']
})

export class UiDynacardInfoComponent {
  sortDirection: string = "";
  sortColumn: string = "Frame";
  pageSize: number = 5; 
  pageNumber = 1;
  currentPage = 0;
  totalCount = 0;
  TotalCount: number = 0;
  pageSizeOption = [10, 20, 30]
  model: any = {};

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  oncheckboxClick: boolean = false;
  cardInfoTableColumns = ['stickyRow']

  classification = [
    "Pump Tagging",
    "Normal",
    // "Last Storke Card",
    "Distorted",
    "Flatlining",
    "Fluid Pound",
    "Gas Interference",
    // "High Fluid Level",
    // "Very High Fluid Level",
    // "Other"
  ]

  dynamicRowsForSelectedStagedTimeFrames = [
    "pumpFillage",
    "spm",
    "minPublishedRodLoad",
    "pickPublishedRodLoad",
    "surfaceStrokeLength",
    "downloadStroke",
    "totalFluid"
  ]

  pinnedFrames: Date[] = [];

  pinnedFrameKey = "pinned-frame-key";

  pinnedFramesDetails = new Map<Date, DynaCardDetailsModel>();

  selectedDynamicRowsForSelectedStagedTimeFrames = Array.from(Array(this.dynamicRowsForSelectedStagedTimeFrames.length).keys());


  pinnedFrameTableColumns: string[] = ['index', '#', 'time', 'cardName', 'primary', 'secondary', "notes", 'SPM', 'PF', 'unpinicon'];


  constructor(private _formBuilder: FormBuilder, private service: AlgorithmsAndMitigationsService, private dynaService: DynacardService) {
    this.dynaService.selectedClassification.subscribe(
      (x) => {
        this.getTableData(x.startDate, x.classfication, x.endDate);
        // this.dynaService.selectedTime.next({ addedOrRemoved: false, selected: 'all' });
        // this.selectionTimeModel.clear();
        this.searchText = '';
        this.searchTextObseravale.next('');
        // //console.log(this.selectedClassification)
      }
    );

    this.updatePinnedFrames();

    // this.dynaService.selectedTime.subscribe(x => {
    //   if (x.addedOrRemoved) {
    //     this.dynaService.getDetailsAboutTime(x.selected).subscribe(y => {
    //       // console.log(y, x.selected);
    //       this.cardInfoTableColumns.push(x.selected);
    //       //console.log(this.cardInfoTableColumns);
    //       this.selectedTimeDetails.set(x.selected, y);
    //     });
    //   }
    //   else {
    //     this.cardInfoTableColumns.splice(this.dynamicRowsForSelectedStagedTimeFrames.findIndex(t => t == x.selected), 1);
    //     this.selectedTimeDetails.delete(x.selected);
    //   }
    // });
    this.dynaService.selectedTime.pipe(takeUntil(this.$takUntil), switchMap(obj => {
      //console.log(obj);
      if (obj.addedOrRemoved) {
        return this.dynaService.getDynaCardDetailsForATime(obj.selected.frame)
          .pipe(
            takeUntil(this.$takUntil),
            map(y => ({ dynaDetails: y, seriesObj: obj.selected })));
      }
      else {
        return of(({ dynaDetails: undefined, seriesObj: obj.selected }));
      }
    })).subscribe(x => {
      //console.log(x);
      // if (x.name.frame == 'all')
      //   this.removeAllSeries();
      // else
      this.updateInHighChartv2(x.dynaDetails, x.dynaDetails != undefined, x.seriesObj);
    });

    // this.dynaService.selectedTimeInGraph.subscribe(x => {
    //   if (x != undefined && x != '')
    //     this.dynaService.getDetailsAboutTime(x).subscribe(y => {
    //       this.selectedTimeDetails = y;
    //     });
    // });
    // this.getChartInfo();


  }
  updatePinnedFrames() {
    var framesString = localStorage.getItem(this.pinnedFrameKey);
    if (framesString != undefined && framesString != null) {
      this.pinnedFrames = JSON.parse(framesString);
      this.updatePinnedFrameDetails();
    }
  }

  updatePinnedFrameDetails(id: Date = null) {
    // if (id != null) {
    this.dynaService
      .getListOfTime("all", '2023-01-01', (new Date()).toISOString())
      .pipe(takeUntil(this.$takUntil))
      .subscribe(y => y.filter(x => id == null ? this.pinnedFrames.findIndex(z => z == x.frame) > -1 : id == x.frame).forEach((x: any) => this.pinnedFramesDetails.set(x.frame, x)));
    // }
    // else
    // this.dynaService.getListOfTime("all",id.toISOString()).pipe(takeUntil(this.$takUntil)).subscribe(y => this.pinnedFramesDetails.set(id, y));
  }

  pinTheFramePlease(frame: DynaCardDetailsModel) {
    if (this.pinnedFramesDetails.has(frame.frame))
      return;
    this.pinnedFrames.push(frame.frame);
    this.pinnedFramesDetails.set(frame.frame, frame);
    localStorage.removeItem(this.pinnedFrameKey);
    localStorage.setItem(this.pinnedFrameKey, JSON.stringify(this.pinnedFrames));
  }

  unPinTheFramePlease(frame) {
    this.pinnedFrames.splice(this.pinnedFrames.findIndex(x => x == frame.frame), 1);
    this.pinnedFramesDetails.delete(frame.frame);
    localStorage.removeItem(this.pinnedFrameKey);
    localStorage.setItem(this.pinnedFrameKey, JSON.stringify(this.pinnedFrames));
  }



  onTimeFrameSelection(option: any){
    switch(option) {
      case 'Day':
        let today = new Date();
        let d = new Date();
        let yesterDay = new Date();
        yesterDay.setDate(d.getDate() - 1);
        this.selectedRangeValue = new DateRange<Date>(yesterDay, today);
        this.dynaService.selectedClassification.next(
          { classfication: 'all', startDate: this.selectedRangeValue.start.toISOString(), endDate: this.selectedRangeValue.end.toISOString() }
        );
        this.bubbleChartTimeSelection('3m');
        // this.GetAlertListWithFilters();
        break;
        case 'Week':
          let curr = new Date(); // get current date
          let first = curr.getDate(); // First day is the day of the month - the day of the week
          let last = first - 6; // last day is the first day + 6
          let currentDay = new Date(curr.setDate(first));
          let fromday = new Date(curr.setDate(last));
          this.selectedRangeValue = new DateRange<Date>(fromday, currentDay);
          // this.getBubbleChartData();
          this.dynaService.selectedClassification.next(
            { classfication: 'all', startDate: this.selectedRangeValue.start.toISOString(), endDate: this.selectedRangeValue.end.toISOString() }
          );
          this.bubbleChartTimeSelection('3m');
        break;
        case 'Month':
          let presentDay = new Date(); // get current date
          let presentDate = presentDay.getDate(); // First day is the day of the month - the day of the week
          let lastDate = presentDate - 30; // last day is the first day + 6
          let presentDateTime = new Date(presentDay.setDate(presentDate));
          let fromDateTime = new Date(presentDay.setDate(lastDate));
          this.selectedRangeValue = new DateRange<Date>(fromDateTime, presentDateTime);
          // this.getBubbleChartData();
          this.dynaService.selectedClassification.next(
            { classfication: 'all', startDate: this.selectedRangeValue.start.toISOString(), endDate: this.selectedRangeValue.end.toISOString() }
          );
          this.bubbleChartTimeSelection('3m');
        break;
    }
  }

  // ngAfterViewInit(): void {

  // }

  reclassifiy(element, event) {
    element.classfication = event.value;
    this.dynaOptions.series.forEach((x: any) => {
      if (x.name.indexOf(element.frame) > -1) {
        x.color = this.markerSvg(element.classfication).color;
      }
    })
    this.updateDynaHighChartFlag = true;
  }

  dynaMeterQuickGetData(seriesObj: any) {
    this.dynaService.getDynaCardDetailsForATime(seriesObj.frame).pipe(takeUntil(this.$takUntil)).subscribe(x => {
      this.updateInDynaQuckView(x, seriesObj);
    });
  }


  /// top bubble chart and legends

  bubbleSeries = [];
  bubbleClassficationInfo!: Classification[];
  bubbleChartSubscription!: Subscription;
  bubbleChartInfoSubscription!: Subscription;
  activeTimeRange: string;
  stagedTimeFrames = new Map<string, CardDetailsModel>();

  Highcharts: typeof Highcharts = Highcharts;



  // constructor() { }
  ngOnInit(): void {
    this.bubbleChartTimeSelection('3m');

  }

  getFrameObj(frame) {
    // console.log(frame);
    return this.stagedTimeFrames.get(frame);
  }

  getChangedTableData(){
    this.dynaService.selectedClassification.subscribe(
      (x) => {
        this.getTableData(x.startDate, x.classfication, x.endDate);
        this.searchText = '';
        this.searchTextObseravale.next('');
      }
    );
  }

  createModel(this: any) {
    this.model.pageSize = this.pageSize;
    this.model.pageNumber = this.pageNumber;
    this.model.sortColumn = this.sortColumn ? this.sortColumn : "Frame";
    this.model.sortDirection = this.sortDirection ? this.sortDirection : "desc";

    return this.model;
  }

  getTableData(startDate: string, classfication: string, endDate: string) {
    var SearchModel = this.createModel();
    this.dynaService.getDynacardList(classfication, startDate, endDate, SearchModel).subscribe((res: any) => {
      this.pageSizeOption = [10, 15, 20, res.totalCount]
      this.listOfTime = res.dynameterTimeFrames;
      setTimeout(() => {
        this.paginator.pageIndex = this.currentPage;
        this.paginator.length = res.totalCount;
      });
    })
  }

  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.pageNumber = event.pageIndex + 1;
    this.dynaService.selectedClassification.next(
      { classfication: 'all', startDate: this.selectedRangeValue.start.toISOString(), endDate: this.selectedRangeValue.end.toISOString() }
    );
    this.bubbleChartTimeSelection('3m');
  }

  public onSortChanged(e: any) {
    this.pageNumber = this.pageNumber;
    this.pageSize = this.pageSize;
    this.sortDirection = this.sort.direction;
    this.sortColumn = (typeof this.sort.active !== "undefined") ? this.sort.active : "";
    this.bubbleChartTimeSelection('3m');
  }

  onClassficationLegendClick(classfication: string) {
    this.dynaService.selectedClassification.next({ classfication: classfication, startDate: this.selectedRangeValue.start.toISOString(), endDate: this.selectedRangeValue.end.toISOString() })
  }

  getBubbleChartData(): void {
    this.bubbleChartSubscription = this.service.getBubbleChartDataV2(this.selectedRangeValue.start, this.selectedRangeValue.end).subscribe((data) => {
      this.bubbleChartOptions.series = this.mapToHighchartObject(data.cards);
      this.bubbleChartUpdate = true;
      this.bubbleClassficationInfo = data.classification;
      this.classification.filter(x => !data.classification.some(y => y.name == x)).forEach(x => this.bubbleClassficationInfo.push({ name: x, count: 0 }))
      // this.bubbleClassficationInfo.forEach(x => {
      //   var updateObj = data.classfication.find(y => y.name.trim().toLocaleLowerCase() == x.type.trim().toLocaleLowerCase());
      //   if (updateObj != undefined)
      //     x.value = updateObj.count;
      //   // this.bubbleChartInfo[this.bubbleChartInfo.length -1 ].value  += .count;
      // });
    })
  }

  mapToHighchartObject(data: DateRangeBubbleChart[]): any {

    const transformedDataMap: Map<string, any> = new Map();

    data.forEach((entry) => {
      entry.classifications.forEach((classification) => {
        if (transformedDataMap.has(classification.name)) {
          const existingEntry = transformedDataMap.get(classification.name);
          var existingDate = (<[]>existingEntry.data).findIndex(x => x[0] == entry.from);
          if (existingDate > -1) {
            existingEntry.data[existingEntry][2] = existingEntry.data[existingEntry][2] + classification.count;
          }
          else
            existingEntry.data.push([entry.from, this.classification.indexOf(classification.name) + 1, classification.count]);
        } else {
          const transformedEntry = {
            name: classification.name,
            marker: this.markerObject(classification.name),
            data: [[entry.from, this.classification.indexOf(classification.name) + 1, classification.count]]
          };
          transformedDataMap.set(classification.name, transformedEntry);
        }
      });
    });

    var result = Array.from(transformedDataMap.values());
    //console.log(result);
    return result;

  }

  markerObject(classfication: string) {
    var marker = {
      symbol: `url(${this.markerSvg(classfication).marker})`
    };
    // switch (classfication) {
    //   case "Pump Tagging":
    //     marker = { symbol: "circle", fillColor: "#57B2C0" };
    //     break;
    //   case "Flatlining":
    //     marker = { symbol: "diamond", fillColor: "#D25299" };
    //     break;
    //   case "Gas Interference":
    //     marker = { symbol: "square", fillColor: "#5433A0" };
    //     break;
    //   case "Fluid Pound":
    //     marker = { symbol: "circle", fillColor: "#EA910D" };
    //     break;
    //   case "Distorted":
    //     marker = { symbol: "square", fillColor: "#FFD200" };
    //     break;
    //   case "Normal":
    //     marker = { symbol: "diamond", fillColor: "#2196F3" };
    //     break;
    //   default:
    //     // Handle unknown classification names
    //     break;
    // }
    return marker;
  }


  markerSvg(classfication: string): { marker, color } {
    let marker = "../assets/images/Circle.svg";
    let color = "#2196F3";
    switch (classfication) {
      case "Pump Tagging":
        color = "#2196F3";
        marker = "../assets/images/Circle.svg";
        break;
      case "Flatlining":
        marker = "../assets/images/Diamond.svg";
        color = "#FF5722";
        break;
      case "Gas Interference":
        marker = "../assets/images/Bar.svg";
        color = "#28A228";
        break;
      case "Fluid Pound":
        marker = "../assets/images/Pentagon.svg";
        color = "#F06292";
        break;
      case "Distorted":
        marker = "../assets/images/Octagon.svg";
        color = "#C248F0";
        break;
      case "Normal":
        marker = "../assets/images/Rectangle.svg";
        color = "#0A7D8F";
        break;
      default:
        // Handle unknown classification names
        break;
    }
    return { marker, color };
  }

  // getMarkerForClassification(name: string) {
  //   var result = this.bubbleClassficationInfo.find(x => x.type == name);
  //   if (result != undefined)
  //     return result.symbolClass;
  //   else
  //     return this.bubbleClassficationInfo[this.bubbleClassficationInfo.length - 1].symbolClass;
  // }

  // getChartInfo() {
  //   this.bubbleChartInfoSubscription = this.service.getChartInfo().subscribe((data) => {
  //     this.bubbleChartInfo = data;
  //   })
  // }

  onPointClick = (p) => {
    this.dynaService.selectedClassification.next(
      { classfication: p.point.series.name, startDate: p.point.options.name, endDate: p.point.options.name }
    );
    // //console.log(p.point.options.z)
  }

  onShowEvent = (p) => {
    //console.log(p);
  }

  bubbleChartUpdate: boolean = false;


  // drawChart() {
  //   // // this.bubbleChartOptions.series.push(this.bubbleSeries);
  //   //console.log(this.bubbleSeries);

  // }

  selectedRangeValue: DateRange<Date>;

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
  }


  bubbleChartTimeSelection(type: string) {
    this.activeTimeRange = type;
    // if (type == '3m') {
    //   const endDate = new Date(); // Today's date
    //   const startDate = new Date(endDate);
    //   startDate.setDate(endDate.getDate() - 59);
    //   this.selectedRangeValue = new DateRange<Date>(startDate, endDate);
    //   this.getBubbleChartData();
    // }
    // else if (type == 'cal') {
    //   this.getBubbleChartData();
    // };
    // TBD - Shivangi
    let curr = new Date(); // get current date
    let first = curr.getDate(); // First day is the day of the month - the day of the week
    let last = first - 6; // last day is the first day + 6
    let today = new Date(curr.setDate(first));
    let fromday = new Date(curr.setDate(last));
    this.selectedRangeValue = new DateRange<Date>(fromday, today);
    // const endDate = new Date();
    // const startDate = new Date(2023, 2, 1);
    // this.selectedRangeValue = new DateRange<Date>(startDate, endDate);
    this.getBubbleChartData();
    this.dynaService.selectedClassification.next(
      { classfication: 'all', startDate: this.selectedRangeValue.start.toISOString(), endDate: this.selectedRangeValue.end.toISOString() }
    );
  }


  displayedColumnsOld: string[] = ['index', '#', 'Classification', 'Frame', 'SPM', 'PumpFillage'];

  stagedTableColumns: string[] = ['index', '#', 'pin', 'time', 'primary_classification', 'secondary_classification', 'SPM', 'PF%'];

  listOfTime: DynaCardDetailsModel[];
  // selectedClassification = new BehaviorSubject<number>(-1);
  selectionTimeModel = new SelectionModel<string>(true);
  selectionTimeStagedModel = new SelectionModel<string>(true);
  searchText: string;
  searchTextObseravale = new BehaviorSubject<string>("");

  tableLoading = false;

  JSON = JSON;

  log = (x) => console.log(x);

  searchTime() {
    this.searchTextObseravale.next(this.searchText);
  }

  selectTime(item: any) {
    this.selectionTimeModel.toggle(item.frame);
    this.dynaService.selectedTime.next({
      addedOrRemoved: this.selectionTimeModel.isSelected(item.frame),
      selected: item
    })
  }

  selectTimeForStaging(timeFrame) {
    this.selectionTimeStagedModel.toggle(timeFrame.frame);
    if (this.selectionTimeStagedModel.isSelected(timeFrame.frame)) {
      this.stagedTimeFrames.set(timeFrame.frame, timeFrame);
      let data = this.listOfTime.find((time: any) => {
        return timeFrame.frame == time.frame;
      })
      // this.dynaService.getDetailsAboutTime(timeFrame.frame).subscribe(y => {
        // console.log(y, x.selected);
        this.cardInfoTableColumns.push(timeFrame.frame);
        //console.log(this.cardInfoTableColumns);
        this.selectedTimeDetails.set(timeFrame.frame, data);
      // });
    }
    else {
      this.selectionTimeModel.deselect(timeFrame.frame);
      this.stagedTimeFrames.delete(timeFrame.frame);
      this.updateInHighChartv2([], false, timeFrame.frame);
      this.selectedTimeDetails.delete(timeFrame.frame);
      this.cardInfoTableColumns.splice(this.cardInfoTableColumns.findIndex(x => x == timeFrame.frame), 1);
    }
    this.oncheckboxClick = !this.selectionTimeStagedModel.isEmpty();
  }

  /// right time series table

  ///dynacard graph

  $takUntil = new Subject<boolean>();

  ngOnDestroy(): void {
    this.$takUntil.next(true);
    this.$takUntil.complete();
  }
  onDynaPointClick = (p) => {
    // //console.log(p.point.series.name);
    this.dynaService.selectedTimeInGraph.next(p.point.series.name);
    // //console.log(p.point.options.z)
  }



  // csvFile: any;
  // private csvText: string = "";
  // allData: DynaCardModel[] | null = null;
  // Index: number = 0;

  updateDynaHighChartFlag: boolean = false;
  updateDynaQuickViewHighChartFlag: boolean = false;

  selectedTimeDetails = new Map<string, DynaCardDetailsModel>();


  // updateChart(event: any) {
  //   this.updateCsvData(event);
  // }

  removeAllSeries() {
    this.dynaOptions.series.splice(0, this.dynaOptions.series.length);
    this.updateDynaHighChartFlag = true;
  }

  updateInDynaQuckView(dynacard: DynacardModel2[], seriesObj: any) {
    var downhole = dynacard.map(x => [x.downhole_Card_Position, x.downhole_Card_Load]);
    var surface = dynacard.map(x => [x.surface_Card_Position, x.surface_Card_Load]);
    var index = this.dynaQuickViewOptions.series.length;
    if (index >= 0 && this.dynaQuickViewOptions.series.findIndex(x => x.name.indexOf(seriesObj.frame) > -1) > -1)
      return;
    if (index >= 0) {
      this.dynaQuickViewOptions.series.splice(0, this.dynaQuickViewOptions.series.length);
    }
    this.dynaQuickViewOptions.series.push({
      id: seriesObj.frame + '-downhole',
      type: 'line',
      data: downhole,
      color: this.markerSvg(seriesObj.classfication).color,
      // colorIndex: index,
      name: seriesObj.frame
    });
    this.dynaQuickViewOptions.series.push({
      id: seriesObj.frame + '-surface',
      type: 'line',
      data: surface,
      // colorIndex: index,
      color: this.markerSvg(seriesObj.classfication).color,
      linkedTo: ':previous',
      name: seriesObj.frame
    });
    this.updateDynaQuickViewHighChartFlag = true;
  }

  updateInHighChartv2(dynacard: DynacardModel2[], addedOrRemoved: boolean, seriesObj: any) {
    //console.log(dynacard, addedOrRemoved);
    // return;
    if (addedOrRemoved) {
      var downhole = dynacard.map(x => [x.downhole_Card_Position, x.downhole_Card_Load]);
      var surface = dynacard.map(x => [x.surface_Card_Position, x.surface_Card_Load]);
      var index = this.dynaOptions.series.length;
      this.dynaOptions.series.push({
        id: seriesObj.frame + '-downhole',
        type: 'line',
        data: downhole,
        color: this.markerSvg(seriesObj.classfication).color,
        legendIndex: index,
        name: seriesObj.frame
      });
      this.dynaOptions.series.push({
        id: seriesObj.frame + '-surface',
        type: 'line',
        data: surface,
        legendIndex: index,
        color: this.markerSvg(seriesObj.classfication).color,
        linkedTo: ':previous',
        name: seriesObj.frame
      });
    }
    else {
      this.dynaOptions.series.filter(
        x => x.id == seriesObj.frame + '-downhole' || x.id == seriesObj.frame + '-surface'
      ).forEach(
        x => {
          var id = this.dynaOptions.series.findIndex(y => y.id == x.id);
          this.dynaOptions.series.splice(id, 1);
        });
    }
    this.updateDynaHighChartFlag = true;
  }

  ///dynacard graph

  dynaOptions: Highcharts.Options = {
    chart: {
      renderTo: 'container',
      backgroundColor: undefined
    },
    legend: {
      itemStyle: {
        color: 'black'
      },
      itemHoverStyle: {
        color: 'grey'
      }
    },
    title: {
      text: ''
    },
    yAxis: {
      title: {
        text: 'Load'
      },
      labels: {
        style: {
          color: 'black'
        }
      }
    },
    xAxis: {
      title: {
        text: 'Position'
      },
      type: 'category',
      tickInterval: 10,
      labels: {
        style: {
          color: 'black'
        }
      }
    },
    plotOptions: {
      series: {
        events: {
          click: this.onDynaPointClick
        },
        point: {
          events: {
            click: this.onDynaPointClick
          }
        }
      }
    },
    series: []
  };

  dynaQuickViewOptions: Highcharts.Options = {
    chart: {
      renderTo: 'container',
      backgroundColor: undefined
    },
    legend: {
      itemStyle: {
        color: 'black'
      },
      itemHoverStyle: {
        color: 'grey'
      }
    },
    title: {
      text: ''
    },
    yAxis: {
      title: {
        text: 'Load'
      },
      labels: {
        style: {
          color: 'black'
        }
      }
    },
    xAxis: {
      title: {
        text: 'Position'
      },
      type: 'category',
      tickInterval: 10,
      labels: {
        style: {
          color: 'black'
        }
      }
    },
    plotOptions: {
      series: {
        events: {
          click: this.onDynaPointClick
        },
        point: {
          events: {
            click: this.onDynaPointClick
          }
        }
      }
    },
    series: []
  };

  ///Seleed Time series


  mappingOfFields = {
    pumpFillage: 'Pump Fillage(%) ',
    spm: 'SPM',
    minPublishedRodLoad: 'Min.Polished Rod Load(lbs)',
    pickPublishedRodLoad: 'Peak Polished Rod Load(lbs)',
    surfaceStrokeLength: 'Surface Stroke Length (in)',
    downloadStroke: 'Downhole Stroke Length (in)',
    totalFluid: 'Total Fluid (in)',
  };

  classficationListdata: { value, viewValue }[] = [
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

  bubbleChartOptions: Highcharts.Options = {
    chart: {
      type: 'bubble',
      // plotBorderWidth: 1,
      spacing: [0, 0, 0, 0],
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
      type: 'category',
      labels: {
        style: {
          color: 'black'
        }
      }
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
        marker: {
          fillOpacity: 1,
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
          inside: true,
          style: {
            textOutline: 'none'
          }
        },
        point: {
          events: {
            click: this.onPointClick
          }
        },
        events: {
          afterAnimate: this.onShowEvent,
          show: this.onShowEvent
        },
        cursor: 'pointer',
        states: {
          hover: {
            enabled: false
          }
          , inactive: {
            enabled: false
          }
        }
      }
    },
    series: this.bubbleSeries
  };


  // BAR CHART

  // chartOptions: Highcharts.Options = {
  //   title: {
  //     text: ''
  //   },
  //   chart: {
  //     plotShadow: true,
  //     renderTo: 'container',
  //     backgroundColor: undefined
  //   },

  //   xAxis: {
  //     categories: ['Runtime(%) 23-06-20', 'Inferred Production(bpd) 23-06-21'],
  //     // labels:{
  //     //   enabled:false
  //     // }
  //     labels: {
  //       style: {
  //         fontSize: '9px'
  //       }
  //     }
  //   },

  //   yAxis: {
  //     // allowDecimals: false,
  //     // min: 100,
  //     labels: {
  //       enabled: false
  //     },
  //     title: {
  //       text: ''
  //     },
  //     tickLength: 0,
  //     gridLineWidth: 0
  //   },
  //   legend: {
  //     enabled: false,
  //   },

  //   tooltip: {
  //     enabled: false,
  //     // headerFormat: '<b>{point.x}</b><br/>', pointFormat:

  //     //   '{series.name}:</b> Total: {point.stackTotal}',
  //   },

  //   plotOptions: {
  //     // column: {
  //     //   stacking: 'normal',
  //     //   allowPointSelect: true,
  //     // },
  //   },

  //   series: [

  //     {
  //       name: "",
  //       data: [30, 60],
  //       type: 'column',
  //       color: '#3097A7',
  //       pointWidth: 40,
  //       dataLabels: {
  //         enabled: true,
  //         inside: false,
  //         style: {
  //           fontSize: '9px'
  //         }
  //       }
  //     },
  //     // {
  //     //   name: "",
  //     //   data: [78, 68],
  //     //   type: 'column',
  //     //   color: '#3097A7',
  //     //   pointWidth: 40
  //     // },

  //   ],
  // };
  // BAR CHART
}


