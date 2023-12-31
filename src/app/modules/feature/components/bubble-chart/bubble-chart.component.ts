import { Component, OnInit, OnDestroy } from '@angular/core';
import * as Highcharts from 'highcharts';
import theme from 'highcharts/themes/brand-dark';
theme(Highcharts);
import More from 'highcharts/highcharts-more'
import { Subscription } from 'rxjs';
import { AlgorithmsAndMitigationsService } from '../../services/algorithms-and-mitigations.service';
// import Highcharts from 'highcharts'
More(Highcharts)

@Component({
  selector: 'app-bubble-chart',
  templateUrl: './bubble-chart.component.html',
  styleUrls: ['./bubble-chart.component.scss']
})
export class BubbleChartComponent implements OnInit {

  series: any = [];
  // chartData!: any;
  chartInfo!: any;
  // Highcharts: typeof Highcharts = Highcharts;
  // chartOptions!: Highcharts.Options;
  chartSubscription!: Subscription;
  chartInfoSubscription!: Subscription;

  constructor(private service: AlgorithmsAndMitigationsService) {}
  ngOnInit(): void {
    this.getChartData();
    this.getChartInfo();
 }

 getChartData(): void{
  this.chartSubscription = this.service.getBubbleChartData().subscribe((data: any) => {
    this.series = data;
    this.drawChart();
  })
  this.drawChart();
 }

 getChartInfo() {
  this.chartInfoSubscription = this.service.getChartInfo().subscribe((data: any) => {
    this.chartInfo = data;
    console.log(this.chartInfo);
  })
 }
  
  drawChart() {

    Highcharts.chart('bubble-chart', {
      chart: {
      type: 'bubble',
      plotBorderWidth: 1,
      zoomType: 'xy'
      },
      colorAxis: [{}, {
      minColor: '#434348',
      maxColor: '#e6ebf5'
      }],
      title: {
      text: ''
      },
      xAxis: {
      gridLineWidth: 0
      },
      yAxis: {
      startOnTick: false,
      endOnTick: false,
      visible: false,
      // gridLineWidth: 1
      },
      tooltip: {
        useHTML: true,
        pointFormat: '<b>{point.name}:</b> {point.value}'
        },
      plotOptions: {
        bubble: {
        minSize: '10%',
        maxSize: '12%',
        // zMin: 0,
        // zMax: 1000,
        layoutAlgorithm: {
        splitSeries: false,
        gravitationalConstant: 0.02
        },
        dataLabels: {
        enabled: true,
        format: `<b>{point.z}</b>`,
        style: {
        color: 'black',
        textOutline: 'none',
        fontWeight: 'normal'
        }
        }
      }},
      series: this.series
      } as any);
  }
}


