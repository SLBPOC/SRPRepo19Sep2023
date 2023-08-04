import { Component } from '@angular/core';
import { DynaCardModel } from '../../model/dyna-card.model';
import * as d3 from 'd3';
import * as Highcharts from 'highcharts';
import { YAxisOptions } from 'highcharts';

@Component({
  selector: 'app-dyna-card',
  templateUrl: './dyna-card.component.html',
  styleUrls: ['./dyna-card.component.scss']
})
export class DynaCardComponent {
  csvFile:any;
  private csvText: string = "";
  allData:DynaCardModel[] | null = null;
  colorIndex:number = 0;

  Highcharts: typeof Highcharts = Highcharts;
  updateHighChartFlag: boolean = false;
  options: Highcharts.Options ={
    chart:{
      renderTo:'container',
      backgroundColor:undefined
    },
    legend:{

    },
    title:{
      text:''
    },
    xAxis:{
      type:'category',
      tickInterval:10
    },
    series:[]
  };

  updateChart(event:any)
  {
    this.updateCsvData(event);
  }

  updateInHighChart(){
    var downhole = this.allData.map(x=>[x.DownholeCardPosition,x.DownholeCardLoad]);
    var surface = this.allData.map(x=>[x.SurfaceCardPosition,x.SurfaceCardLoad]);
    console.log(this.allData[0]);
    this.options.series.push({
      type:'line',
      data: downhole,
      colorIndex :this.colorIndex,
      name:this.allData[0].DownholeCardTime
    });
    this.options.series.push({
      type:'line',
      data:surface,
      colorIndex :this.colorIndex,
      linkedTo:':previous',
      name:this.allData[0].DownholeCardTime
    })
    this.updateHighChartFlag = true;
    this.colorIndex++;
  }

  mapToArray()
  {
    var data:DynaCardModel[] = d3.csvParse(this.csvText);
    data.forEach( x=> {
      x.DownholeCardLoad = +x.DownholeCardLoad;
      x.DownholeCardPosition = +x.DownholeCardPosition;
      x.SurfaceCardLoad = +x.SurfaceCardLoad;
      x.SurfaceCardPosition = +x.SurfaceCardPosition;
      x.DownholeCardTime = x["DownholeCard Time"]
      x.SurfaceCardTime = x["SurfaceCard Time"]
    })
    this.allData = data;
    this.updateInHighChart();
  }

  updateCsvData(event:any){
    let fileReader = new FileReader();
    fileReader.onload = (e:any) => {
      this.csvText = <string>fileReader.result;
      this.mapToArray();
    }
    fileReader.readAsText(event.target.files[0]);
  }
}
