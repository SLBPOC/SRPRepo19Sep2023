import { Component } from '@angular/core';
import * as Highcharts from 'highcharts';
@Component({
  selector: 'app-alert-categories-chart',
  templateUrl: './alert-categories-chart.component.html',
  styleUrls: ['./alert-categories-chart.component.scss']
})
export class AlertCategoriesChartComponent {
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {
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
      
    ]
  };
  constructor(){
    this.chartOptions.series =  [
      {
        type: 'pie', 
        name: 'Cycle Status',
        
        data: [
          {
            name: 'Gas Interference Events',
            y: 15,
            color: '#F38888',
          },
          {
            name: 'Fluid Pound Events',
            y: 25,
            color: '#8760CC'
          },
          {
            name: 'Flatlining Events',
            y: 25,
            color: '#7DCCD8'
          },
          {
            name: 'Tagging Events',
            y: 15,
            color: '#3097A7'
          },
          {
            name: 'Current SPM',
            y: 10,
            color: '#DA44AA'
          }

        ]
      }
    ]
  }
}
