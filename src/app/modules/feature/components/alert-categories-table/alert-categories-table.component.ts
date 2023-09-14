import { Component } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-alert-categories-table',
  templateUrl: './alert-categories-table.component.html',
  styleUrls: ['./alert-categories-table.component.scss']
})
export class AlertCategoriesTableComponent {
  displayedColumns = ['wellname', 'noofalerts', 'snoozedalerts', 'priority'];
  dataSource = ELEMENT_DATA;
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {
    chart: {
      type: 'pie',
      renderTo: 'container',
      margin: 0,
      spacing: [0,0,0,0],
      backgroundColor: undefined
    },
    
    yAxis: {
      labels: {
        enabled: false
      },
      tickAmount: 6,
      gridLineWidth: 1,
      visible: false
    },
    xAxis: {
      labels: {
        enabled: false
      },
      tickAmount: 6,
      gridLineWidth: 1,
      visible: false
    },
    title: {
      text: ''
    },
   plotOptions: {
        bar: {
            dataLabels: {
                enabled: true,
                inside: true,
                align: 'left',
                x: -40
            },

        }
    },
    
    series: [
      
    ]
  };
  onSortChanged(event:any){

  }
  constructor(){
    this.chartOptions.series =  [
      {
        type: 'bar',
        data: [
          {
            name: '',
            y: 10,
            color: 'red'
          },
          
          {
            name: '',
            y: 25,
            color: 'orange'
          },
          {
            name: '',
            y: 50,
            color: 'green'
          },
        ]
      }
    ]
  }

}
export interface PeriodicElement {
  wellname: string;
  noofalerts: number;
  snoozedalerts: number;
  
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
   
    wellname: 'well-001',
    noofalerts: 100,
    snoozedalerts: 35,
    
  },
  {
   
    wellname: 'well-002',
    noofalerts: 90,
    snoozedalerts: 20,
    
  },
  {
   
    wellname: 'well-003',
    noofalerts: 80,
    snoozedalerts: 20,
    
    
  },
  {
   
    wellname: 'well-004',
    noofalerts: 70,
    snoozedalerts: 30,
   
  },
  {
   
    wellname: 'well-005',
    noofalerts: 60,
    snoozedalerts: 40,
    
  },
  {
   
    wellname: 'well-005',
    noofalerts: 60,
    snoozedalerts: 40,
    
  },
  {
   
    wellname: 'well-005',
    noofalerts: 60,
    snoozedalerts: 40,
   
  },
  {
   
    wellname: 'well-005',
    noofalerts: 60,
    snoozedalerts: 40,
    
  },
  {
   
    wellname: 'well-005',
    noofalerts: 60,
    snoozedalerts: 40,
  
  },
  
  {
    wellname: 'well-005',
    noofalerts: 60,
    snoozedalerts: 40,
  },
    
  {
   
    wellname: 'well-005',
    noofalerts: 60,
    snoozedalerts: 40
  },
]