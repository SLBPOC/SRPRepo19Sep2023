import { Component } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-well-details-dynacard-barchart',
  templateUrl: './well-details-dynacard-barchart.component.html',
  styleUrls: ['./well-details-dynacard-barchart.component.scss']
})
export class WellDetailsDynacardBarchartComponent {
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {
    title:{
      text:''
  },
    chart: {
      plotShadow: true,
      renderTo: 'container',
    },

    xAxis: {
      categories: ['Runtime(%) 23-06-20','Inferred Production(bpd) 23-06-21'],
    
    },
  
    yAxis: {
      allowDecimals: false,
      min: 100,
    },

    tooltip: {
      
      headerFormat: '<b>{point.x}</b><br/>',pointFormat:
      
        '{series.name}:</b> Total: {point.stackTotal}',
    },

    plotOptions: {
      column: {
        stacking: 'normal',
        allowPointSelect: true,
      },
    },

    series: [
       
      { 
        name: "",
        data: [40, 55],
        type: 'column',
        color: '#3097A7',
        pointWidth: 40
      },
      {
        name: "",
        data: [78,68,],
        type: 'column',
        color: '#3097A7',
        pointWidth: 40
      },
     
    ],
  };

}
