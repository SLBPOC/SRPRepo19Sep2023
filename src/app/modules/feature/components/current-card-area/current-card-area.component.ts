import { Component } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-current-card-area',
  templateUrl: './current-card-area.component.html',
  styleUrls: ['./current-card-area.component.scss'],
})
export class CurrentCardAreaComponent {
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {
    title: {
      text: 'Current Card Area ',
    },

    chart: {
      type: 'boxplot',
    },
    xAxis: {
      categories: ['1'],
      title: {
        text: 'Area',
      },
    },

    yAxis: {
      title: {
        text: 'freq',
      },
      plotLines: [
        {
          value: 932,
          color: 'orange',
          width: 1,
          label: {
            text: ' Mean: 273.5',
            align: 'left',
            style: {
              color: 'green',
            },
          },
        },
      ],
    },

    series: [
      {
        name: 'Observations',
        color:'orange',
        data: [
          [733, 853, 939, 980, 1080],
         
        ],
        type: 'boxplot',
        tooltip: {
          headerFormat: '<em>Experiment No {point.key}</em><br/>',
        },
      },
      {
        name: 'Outlier',
        color: Highcharts.getOptions().colors[0],
        type: 'scatter',
        // data: [
        //   // x, y positions where 0 is the first category
        //   [0, 644],
        //   [4, 718],
        //   [4, 951],
        //   [4, 969],
        // ],
        marker: {
            fillColor: 'orange',
            lineWidth: 1,
            lineColor: Highcharts.getOptions().colors[0]
        },
        // tooltip: {
        //     pointFormat: 'Observation: {point.y}'
        // }
      },
    ],
  };
}
