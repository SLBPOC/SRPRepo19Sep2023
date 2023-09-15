import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import * as Highcharts from 'highcharts';
@Component({
  selector: 'app-alert-categories-chart',
  templateUrl: './alert-categories-chart.component.html',
  styleUrls: ['./alert-categories-chart.component.scss']
})
export class AlertCategoriesChartComponent implements OnInit, OnChanges {
  @Input() chartData: any;

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options;
  constructor() { }

  ngOnInit() {

  }

  ngOnChanges() {
    this.loadChartData();
  }

  loadChartData() {
    let chartSeriesArr = []
    let obj = {}
    for (let i = 0; i < this.chartData.length; i++) {
      obj = {
        name: this.chartData[i].name,
        y: this.chartData[i].value
      }
      chartSeriesArr.push(obj)
    }

    this.chartOptions = {
      chart: {
        type: 'pie',
        backgroundColor: '#fff',
      },
      title: {
        text: ''
      },
      plotOptions: {
        pie: {
          innerSize: '50%',
           dataLabels: {
            enabled: false
          },
          showInLegend: true,
        }
      },
      legend: {
        align: 'left', 
        layout: 'horizontal', 
        verticalAlign: 'top', 
        labelFormat: '<b>{name}</b>: {percentage:.1f}%',
        symbolRadius: 0,
        itemStyle:{'color':'#22263D'}
  
        
      },
      series: [
        {
          type: 'pie',
          name: 'Cycle Status',
          data: chartSeriesArr
        }
      ]
    };
  }
}
