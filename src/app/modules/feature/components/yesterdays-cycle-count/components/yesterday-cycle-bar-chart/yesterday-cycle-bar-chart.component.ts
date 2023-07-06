import { Component } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-yesterday-cycle-bar-chart',
  templateUrl: './yesterday-cycle-bar-chart.component.html',
  styleUrls: ['./yesterday-cycle-bar-chart.component.css']
})
export class YesterdayCycleBarChartComponent {
  series: any;

  public ngAfterViewInit(): void {
     this.createChartLine();
  }

  private getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  private createChartLine(): void {
    let date = new Date();

    const data: any[] = [];
    for (let i = 0; i < 10; i++) {
      // date.setDate(new Date().getDate() + i);
      // data.push([`Well Name ${this.getRandomNumber(0, 100)}`, this.getRandomNumber(0, 500)])
      data.push([`Well Name ${this.getRandomNumber(0, 100)}`, this.getRandomNumber(0, 500), {marker: {fill: '#ededed'}}])

    }

    const chart = Highcharts.chart('chart-column', {
      // colors: ['lightblue', 'orange'],
      // colors: ['#811010', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
      chart: {
        type: 'column',
        backgroundColor: {
          // linearGradient: [0, 0, 500, 500],
          // stops: [
          //   [0, 'rgb(255, 255, 255)'],
          //   [1, 'rgb(200, 200, 255)']
          // ]
        },
        polar: true,
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
      yAxis: [{
        lineWidth: 1,
        title: {
            text: 'Cycle count'
        }
    },
  ],
    plotOptions: {
      
      column: {
        colorByPoint: true,
          zones: [{
              value: 300, // Values up to 10 (not including) ...
               color: '#28a745' // ... have the color blue.
           },{
              color: '#dc3545' // Values from 10 (including) and up have the color red!important
           }]
       },
      legend: {
        symbolHeight: 12,
        symbolWidth: 12,
        symbolRadius: 0
      },
      series: {
          marker: {
              symbol: 'circle'
          },
          states: {
            inactive: {
              enabled: false
            }
          },
          events: {
            mouseOver: (e: any) => {              
            }
          }
      }
    },
      xAxis: {
        type: 'category',
        gridLineWidth: 1,
      },
      tooltip: {
        headerFormat: `<div>Cycle Count: {point.key}</div>`,
        pointFormat: `<div>{series.name}: {point.y}</div>`,
        shared: true,
        useHTML: true,
      },
      // ------------------------option 1
      series: [{
        name: 'Wells',
        // data: [['21/6', 500], ['22/6', 500], ['23/6', 700], ['24/6', 500], ['25/6', 500], ['26/6', 500], ['27/6', 500]]
        data,
        showInLegend: true,
        mouseOver: (e: any) => {          
        }


      },
      // {
      //   name: 'Product',
      //   data: data2,
      //   yAxis: 1

      // }

    ],

      // ------------------------option 2
    //   series: [{  
    //     name: 'Quantity',  
    //     data: [500, 700, 555, 444, 777, 877, 944, 567, 666, 789, 456, 654]  
    //  },{  
    //     name: 'Price',  
    //     data: [677, 455, 677, 877, 455, 778, 888, 567, 785, 488, 567, 654]  
    //  }]
    } as any);

    // setInterval(() => {
    //   chart.series[0].addPoint(this.getRandomNumber(0, 1000), true, true);
    // }, 1500)

    // setInterval(() => {
    //   chart.series[0].addPoint([`Well Name ${this.getRandomNumber(0, 100)}`, this.getRandomNumber(0, 500)], true, true);
    // }, 1500)
  }
}
