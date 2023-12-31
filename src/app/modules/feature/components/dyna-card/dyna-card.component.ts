import { Component, OnInit,OnDestroy } from '@angular/core';
import { DynaCardModel, DynacardModel2 } from '../../model/dyna-card.model';
import * as d3 from 'd3';
import * as Highcharts from 'highcharts';
import { YAxisOptions } from 'highcharts';
import { DynacardService } from '../../services/dynacard.service';
import { Subject, switchMap,of,map,takeUntil } from 'rxjs';

@Component({
  selector: 'app-dyna-card',
  templateUrl: './dyna-card.component.html',
  styleUrls: ['./dyna-card.component.scss']
})
export class DynaCardComponent implements OnInit,OnDestroy {

  $takUntil  = new Subject<boolean>();

  constructor(private dynaservice: DynacardService) {
  }
  ngOnDestroy(): void {
    this.$takUntil.next(true);
    this.$takUntil.complete();
  }
  ngOnInit(): void {
    this.dynaservice.selectedTime.pipe(takeUntil(this.$takUntil),switchMap(obj => {
      if (obj.addedOrRemoved) {
        return this.dynaservice.getDynaCardDetailsForATime(obj.selected)
        .pipe(
          takeUntil(this.$takUntil),
          map(y=>({dynaDetails:y,name:obj.selected})));
      }
      else {
        return of(({dynaDetails:undefined,name:obj.selected}));
      }
    })).subscribe(x => {
       this.updateInHighChartv2(x.dynaDetails, x.dynaDetails != undefined,x.name);
    });
  }



  csvFile: any;
  private csvText: string = "";
  allData: DynaCardModel[] | null = null;
  Index: number = 0;

  Highcharts: typeof Highcharts = Highcharts;
  updateHighChartFlag: boolean = false;
  options: Highcharts.Options = {
    chart: {
      renderTo: 'container',
      backgroundColor: undefined
    },
    legend: {

    },
    title: {
      text: ''
    },
    yAxis:{
      title:{
        text:'Load'
      }
    },
    xAxis: {
      title:{
        text:'Position'
      },
      type: 'category',
      tickInterval: 10
    },
    series: []
  };

  // updateChart(event: any) {
  //   this.updateCsvData(event);
  // }


  updateInHighChartv2(dynacard: DynacardModel2[], addedOrRemoved: boolean,name:string) {
    console.log(dynacard,addedOrRemoved);
    // return;
    if (addedOrRemoved) {
      var downhole = dynacard.map(x => [x.downhole_Card_Position, x.downhole_Card_Load]);
      var surface = dynacard.map(x => [x.surface_Card_Position, x.surface_Card_Load]);
      this.options.series.push({
        id: name + '-downhole',
        type: 'line',
        data: downhole,
        colorIndex: this.Index,
        name: name
      });
      this.options.series.push({
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
      this.options.series.filter(
        x => x.id == name + '-downhole' || x.id == name + '-surface'
      ).forEach(
        x => {
          var id = this.options.series.findIndex(y => y.id == x.id);
          this.options.series.splice(id, 1);
        });
    }
    this.updateHighChartFlag = true;
  }

  // updateInHighChart() {
  //   var downhole = this.allData.map(x => [x.DownholeCardPosition, x.DownholeCardLoad]);
  //   var surface = this.allData.map(x => [x.SurfaceCardPosition, x.SurfaceCardLoad]);
  //   console.log(this.allData[0]);
  //   this.options.series.push({
  //     type: 'line',
  //     data: downhole,
  //     colorIndex: this.Index,
  //     name: this.allData[0].DownholeCardTime
  //   });
  //   this.options.series.push({
  //     type: 'line',
  //     data: surface,
  //     colorIndex: this.Index,
  //     linkedTo: ':previous',
  //     name: this.allData[0].DownholeCardTime
  //   })
  //   this.updateHighChartFlag = true;
  //   this.Index++;
  // }

  // mapToArray() {
  //   var data: DynaCardModel[] = d3.csvParse(this.csvText);
  //   data.forEach(x => {
  //     x.DownholeCardLoad = +x.DownholeCardLoad;
  //     x.DownholeCardPosition = +x.DownholeCardPosition;
  //     x.SurfaceCardLoad = +x.SurfaceCardLoad;
  //     x.SurfaceCardPosition = +x.SurfaceCardPosition;
  //     x.DownholeCardTime = x["DownholeCard Time"]
  //     x.SurfaceCardTime = x["SurfaceCard Time"]
  //   })
  //   this.allData = data;
  //   this.updateInHighChart();
  // }

  // updateCsvData(event: any) {
  //   let fileReader = new FileReader();
  //   fileReader.onload = (e: any) => {
  //     this.csvText = <string>fileReader.result;
  //     this.mapToArray();
  //   }
  //   fileReader.readAsText(event.target.files[0]);
  // }
}
