import { Component, AfterViewInit, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { Subscription } from 'rxjs';
import { AlgorithmsAndMitigationsService } from 'src/app/modules/feature/services/algorithms-and-mitigations.service';

@Component({
  selector: 'app-algo-line-chart',
  templateUrl: './algo-line-chart.component.html',
  styleUrls: ['./algo-line-chart.component.scss']
})
export class AlgoLineChartComponent implements AfterViewInit, OnInit{

  series: any = [];
  chartData!: any;
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions!: Highcharts.Options;
  chartSubscription!: Subscription;

  constructor(private service: AlgorithmsAndMitigationsService) {}

  public ngAfterViewInit(): void {
    this.createChartLine();
 }

 private getRandomNumber(min: number, max: number): number {
   return Math.floor(Math.random() * (max - min + 1) + min)
 }

 ngOnInit(): void {
    this.getChartData();
 }

 getChartData(): void{
  this.service.getAlgorithmsAndMitigationsChartData().subscribe((data: any) => {
    this.series = data;
    this.drawChart();

  })
 }

 drawChart(): void {
  const chart = Highcharts.chart('line-chart', {
    chart: {
      type: 'line'
    },
    title: {
      text: '',
    },
    credits: {
      enabled: false,
    },
    legend: {
      enabled: true,
    },
    // yAxis: {
    //   title: {
    //     text: null,
    //   },
    // },
    yAxis: [{
      lineWidth: 1,
      title: {
          text: 'Primary Axis'
      }
  }, 
  // {
  //     lineWidth: 1,
  //     opposite: true,        
  //     title: {
  //         text: 'Secondary Axis',
  //     },
  //     gridLineWidth: 2
  // }
],
  plotOptions: {
    series: {
        marker: {
            symbol: 'circle'
        }

    }
  },
    xAxis: {
      type: 'category',
      gridLineWidth: 1,
    },
    tooltip: {
      headerFormat: `<div>Date: {point.key}</div>`,
      pointFormat: `<div>{series.name}: {point.y}</div>`,
      shared: true,
      useHTML: true,
    },
    // ------------------------option 1
 //    series: [{
 //      name: 'Amount',
 //      // data: [['21/6', 500], ['22/6', 500], ['23/6', 700], ['24/6', 500], ['25/6', 500], ['26/6', 500], ['27/6', 500]]
 //      data1,
 //    },
 //    {
 //      name: 'Product',
 //      data: data2,
 //      yAxis: 1

 //    }

 //  ],

    // ------------------------option 2
    series: this.series
  } as any);
 }
 private createChartLine(): void {
   let date = new Date();
   let date2 = new Date();

   const data1: any[] = [];
   const data2: any[] = [];

   for (let i = 0; i < 10; i++) {

     date.setDate(new Date().getDate() + i);
     date2.setDate(new Date().getDate() + i );

     data1.push([`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`, this.getRandomNumber(0, 1000)]);
     data2.push([`${date2.getDate()}/${date2.getMonth() + 1}/${date.getFullYear()}`, this.getRandomNumber(0, 1000)]);

   }

   

 }

}
