import { Component, ViewChild ,Injectable} from '@angular/core';
import { FormControl } from '@angular/forms';
import * as Highcharts from 'highcharts';
import { Options } from "highcharts";
import {TelemetryBarChartModel} from 'src/app/modules/feature/model/parameterGraphModel';
import {DashboardService } from 'src/app/modules/feature/services/dashboard.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-telemetry-bar-chart',
  templateUrl: './telemetry-bar-chart.component.html',
  styleUrls: ['./telemetry-bar-chart.component.scss']
})
export class TelemetryBarChartComponent {

public ChartOptions:any;
Highcharts: typeof Highcharts = Highcharts;
chartRef:any;


series :any[]=[]; 
updateFromInput = false;

yaxisdataarray=[{ labels: {   style: { fontSize: 10 } },
  lineWidth: 0,tickAmount:4,
  title: { text: null},showEmpty: false}];

YAxisFluidPound:any[] =[];
YAxisGasInterference:any[] =[];
YAxisTagging:any[] =[];
YAxisFlatlining:any[] =[];

XAxis:any[]=[];
dataList:TelemetryBarChartModel[]=[]; 

constructor(private _parameterGraphService: DashboardService,private datepipe:DatePipe)
{
  
} 

chartCallback: Highcharts.ChartCallbackFunction = chart => {
  this.chartRef = chart;
};

ngOnInit()
{  
this.GetGraphDetails();
}

GetGraphDetails()
{
this._parameterGraphService.GetTelemetryBarChart().subscribe((response: any) => {
  this.dataList=response;
  for(let i=0;i<this.dataList.length;i++)
  {
    this.dataList[i].dateAndTime=this.datepipe.transform(this.dataList[i].dateAndTime,'longDate');      
  }
  // Bind X Axis values
  this.XAxis = this.dataList.map(item => item.dateAndTime).filter((value, index, self) => self.indexOf(value) === index);
  this.BindSeriesDetails();
 
});
}

BindSeriesDetails()
{
var id=0;
this.series=[];
if(this.dataList!=null)
{  
  
  for(let i=0;i<this.dataList.length;i++)
  {
    this.YAxisFluidPound.push([this.dataList[i].dateAndTime.toString(),this.dataList[i].fluidpound]);           
    this.YAxisGasInterference.push([this.dataList[i].dateAndTime.toString(),this.dataList[i].gasinterference]);  
    this.YAxisTagging.push([this.dataList[i].dateAndTime.toString(),this.dataList[i].tagging]); 
    this.YAxisFlatlining.push([this.dataList[i].dateAndTime.toString(),this.dataList[i].flatlining]);                 
  }
  
  this.series.push({id:id++,name:"fluid pound",data:this.YAxisFluidPound,lineWidth:2,visible:true,yAxis:0,dataLabels: {
    enabled: true,
    rotation: 0,
    color: '#FFFFFF',
    align: 'right',
    y: -5, // 10 pixels down from the top
    style: {
        fontSize: '10px',
        fontFamily: 'helvetica, arial, sans-serif',
        textShadow: false,
        fontWeight: 'normal'

    }
}});
  this.series.push({id:id++,name:"Gas Intereference",data:this.YAxisGasInterference,lineWidth:2,visible:true,dataLabels: {
    enabled: true,
    rotation: 0,
    color: '#FFFFFF',
    align: 'right',
    y: -5, // 10 pixels down from the top
    style: {
        fontSize: '10px',
        fontFamily: 'helvetica, arial, sans-serif',
        textShadow: false,
        fontWeight: 'normal'

    }
}});
  this.series.push({id:id++,name:"Tagging",data:this.YAxisTagging,lineWidth:2,visible:true,dataLabels: {
    enabled: true,
    rotation: 0,
    color: '#FFFFFF',
    align: 'right',
    y: -5, // 10 pixels down from the top
    style: {
        fontSize: '10px',
        fontFamily: 'helvetica, arial, sans-serif',
        textShadow: false,
        fontWeight: 'normal'

    }
}});  
this.series.push({id:id++,name:"Flatlining",data:this.YAxisFlatlining,lineWidth:2,visible:true,dataLabels: {
  enabled: true,
  rotation: 0,
  color: '#FFFFFF',
  align: 'right',
  y: -5, // 10 pixels down from the top
  style: {
      fontSize: '10px',
      fontFamily: 'helvetica, arial, sans-serif',
      textShadow: false,
      fontWeight: 'normal'
      

  }
}});

}
this.BindChart();
}


BindChart()
{
var that = this;
this.ChartOptions = {      
  chart: {
      renderTo: 'container',
      type: 'column',
     // margin: 80, 
      width:1000, 
      events: {
        load: function() {
          var chart : any = this;
            
          }
      }
},            
title: {
  text: '',
  marginTop:0
},
legend:{    
  layout: "horizontal",
      align: "left"    	     	
  },    
  yAxis: this.yaxisdataarray,
  xAxis: {
    type: 'category',
    categories: this.XAxis,
    labels: {   rotation: 0,style:{fontSize: 10}  }   
  },  
  plotOptions: {
    series: {
      marker:{
        enabled:false
        }   
    },
    column:{pointWidth:20}   // Column width Adjust
  },
  series:this.series,   
  } as any;
}




}