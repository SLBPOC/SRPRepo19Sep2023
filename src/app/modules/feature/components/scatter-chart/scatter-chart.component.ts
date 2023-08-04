import { Component, OnInit, OnDestroy } from '@angular/core';
import * as Highcharts from 'highcharts';
import theme from 'highcharts/themes/brand-dark';
theme(Highcharts);
import { Subscription } from 'rxjs';
import { AlgorithmsAndMitigationsService } from '../../services/algorithms-and-mitigations.service';

@Component({
  selector: 'app-scatter-chart',
  templateUrl: './scatter-chart.component.html',
  styleUrls: ['./scatter-chart.component.scss']
})
export class ScatterChartComponent implements OnInit, OnDestroy{

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
  // this.chartSubscription = this.service.getScatterChartData().subscribe((data: any) => {
  //   this.series = data;
  //   this.drawChart();
  // })
  this.series = [
    {
      "name": "Basketball",
      "marker": {
       "symbol": "circle"
   },
      "color": "rgba(223, 83, 83, .5)",
      "data": [[161.2, 51.6], [167.5, 59.0], [159.5, 49.2], [157.0, 63.0]]
    },
    {
      "name": "VolleyBall",
      "marker": {
       "symbol": "triangle"
   },
   "color": "rgba(119, 152, 191, .5)",
   "data": [[174.0, 65.6], [175.3, 71.8], [193.5, 80.7], [186.5, 72.6],
      [187.2, 78.8], [181.5, 74.8], [184.0, 86.4], [184.5, 78.4]]
    },
  ]
  this.drawChart();
 }


  drawChart() {
    Highcharts.setOptions({
      colors: ['rgba(5,141,199,0.5)', 'rgba(80,180,50,0.5)', 'rgba(237,86,27,0.5)']
    });

    Highcharts.chart('scatter-chart', {
      chart: {
        type: 'scatter',
        zoomType: 'xy'
      },
      title: {
        text: 'Scatter chart',
        align: 'left'
      },
      // subtitle: {
      //   text:
      //     'Source: <a href="https://www.theguardian.com/sport/datablog/2012/aug/07/olympics-2012-athletes-age-weight-height">The Guardian</a>',
      //   align: 'left'
      // },
      xAxis: {
        title: {
          text: 'Height'
        },
        labels: {
          format: '{value} m'
        },
        startOnTick: true,
        endOnTick: true,
        showLastLabel: true
      },
      yAxis: {
        title: {
          text: 'Weight'
        },
        labels: {
          format: '{value} kg'
        }
      },
      legend: {
        enabled: true
      },
      plotOptions: {
        scatter: {
          marker: {
            radius: 2.5,
            symbol: 'circle',
            states: {
              hover: {
                enabled: true,
                lineColor: 'rgb(100,100,100)'
              }
            }
          },
          states: {
            hover: {
              marker: {
                enabled: false
              }
            }
          },
          jitter: {
            x: 0.005
          }
        }
      },
      tooltip: {
        pointFormat: 'Height: {point.x} m <br/> Weight: {point.y} kg'
      },
      series: this.series
    } as any

    );
  }
 ngOnDestroy(): void {
     this.chartSubscription.unsubscribe();
 }

}
