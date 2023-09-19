import { Component, OnInit, OnDestroy } from '@angular/core';
import * as Highcharts from 'highcharts';
import highchartsHeatmap from 'highcharts/modules/heatmap';
highchartsHeatmap(Highcharts);
// highchartsHeatmap(Highcharts);
import theme from 'highcharts/themes/brand-dark';
theme(Highcharts);
import { Subscription } from 'rxjs';
import { AlgorithmsAndMitigationsService } from '../../../../services/algorithms-and-mitigations.service';

@Component({
  selector: 'app-heat-map',
  templateUrl: './heat-map.component.html',
  styleUrls: ['./heat-map.component.scss']
})
export class HeatMapComponent {
  series: any = [];
  chartData!: any;
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions!: Highcharts.Options;
  chartSubscription!: Subscription;

  constructor(private service: AlgorithmsAndMitigationsService) {}

 ngOnInit(): void {
    this.getChartData();
 }

 getChartData(): void{
  this.chartSubscription = this.service.getHeatMapChartData().subscribe((data: any) => {
    console.log('heatmapchartdata', data)
    this.chartData = data;
    this.drawChart();

  })
 }

 drawChart(): void {
  Highcharts.chart('container', {
    chart: {
      type: 'heatmap',
      marginTop: 40,
      marginBottom: 80,
      plotBorderWidth: 1
  },
    title: {
      text: 'Sales per employee per weekday',
      style: {
          fontSize: '1em'
      }
  },

  xAxis: {
      categories: ['Alexander', 'Marie', 'Maximilian', 'Sophia', 'Lukas',
          'Maria', 'Leon', 'Anna', 'Tim', 'Laura']
  },

  yAxis: {
      categories: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      title: null,
      reversed: true
  },

    accessibility: {
      point: {
          descriptionFormat: '{(add index 1)}. ' +
              '{series.xAxis.categories.(x)} sales ' +
              '{series.yAxis.categories.(y)}, {value}.'
      }
  },
    colorAxis: {
      min: 0,
      minColor: '#FFFFFF',
      // maxColor: Highcharts.getOptions().colors[0]
      // maxColor: 'rgba(255, 0, 0, 0.647)'
      // maxColor: '#3f51b5',
      maxColor: '#051464'

  },

  legend: {
      align: 'right',
      layout: 'vertical',
      margin: 0,
      verticalAlign: 'top',
      y: 25,
      symbolHeight: 280
  },
  plotOptions: {
    // series: {
    //     marker: {
    //         symbol: 'circle'
    //     }
    // }
  },

    tooltip: {
      format: '<b>{series.xAxis.categories.(point.x)}</b> sold<br>' +
          '<b>{point.value}</b> items on <br>' +
          '<b>{series.yAxis.categories.(point.y)}</b>'
  },
    series: [{
      name: 'Sales per employee',
      // borderWidth: 1,
      data: this.chartData,
      dataLabels: {
          enabled: true,
          // color: '#000000'
      }
  }],

    responsive: {
      rules: [{
          condition: {
              maxWidth: 500
          },
          chartOptions: {
              yAxis: {
                  labels: {
                      format: '{substr value 0 1}'
                  }
              }
          }
      }]
  }
  } as any);
 }

 ngOnDestroy(): void {
     this.chartSubscription.unsubscribe();
 }

}
