import { Component, ViewChild ,Injectable} from '@angular/core';
import { FormControl } from '@angular/forms';
import * as Highcharts from 'highcharts';
import { Options } from "highcharts";
import {TelemetryModel} from 'src/app/modules/feature/model/parameterGraphModel';
import {DashboardService } from 'src/app/modules/feature/services/dashboard.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-telemetry-line-chart',
  templateUrl: './telemetry-line-chart.component.html',
  styleUrls: ['./telemetry-line-chart.component.scss']
})
export class TelemetryLineChartComponent {
  
  public ChartOptions:any;
  Highcharts: typeof Highcharts = Highcharts;
  chartRef:any;

 
  series :any[]=[];
  yaxisdataarray=[{ labels: {   style: { fontSize: 10 } },
                    lineWidth: 0,tickAmount:15,
                    title: { text: "Inferred Production" },showEmpty: false},
                    { labels: { style: { fontSize: 10} },
                    lineWidth: 0,tickAmount:15,
                    opposite: true,  
                    title: { text:  "VFD Speed" },showEmpty: false},
                    { labels: { style: { fontSize: 10} },
                    lineWidth: 0,tickAmount:15,
                    opposite: true,  
                    title: { text:  "Optimizer PI" },showEmpty: false}];
  updateFromInput = false;

  YAxisInferredProduction:any[] =[];
  YAxisVFDSpeed:any[] =[];
  YAxisOptimizerPI:any[] =[];

  XAxis:any[]=[];
  dataList:TelemetryModel[]=[]; 

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
  this._parameterGraphService.GetTelemetryChart().subscribe((response: any) => {
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
      this.YAxisInferredProduction.push([this.dataList[i].dateAndTime.toString(),this.dataList[i].inferredProduction]);           
      this.YAxisVFDSpeed.push([this.dataList[i].dateAndTime.toString(),this.dataList[i].vfdSpeed]);  
      this.YAxisOptimizerPI.push([this.dataList[i].dateAndTime.toString(),this.dataList[i].optimizerPI]);               
    }
    
    this.series.push({id:id++,name:"Inferred Production",data:this.YAxisInferredProduction,lineWidth:2,visible:true,yAxis:0});
    this.series.push({id:id++,name:"VFD Speed",data:this.YAxisVFDSpeed,lineWidth:2,visible:true,yAxis:1});
    this.series.push({id:id++,name:"Optimizer PI",data:this.YAxisOptimizerPI,lineWidth:2,visible:true,yAxis:2});  
  }
  this.BindChart();
}


BindChart()
{
  var that = this;
  this.ChartOptions = {      
    chart: {
        renderTo: 'container',
        type: 'line',
        margin: 80,      
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
    yAxis: this.yaxisdataarray,tickAmount: 20,
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
      }    
    },
    series:this.series,   
    } as any;
}




}


