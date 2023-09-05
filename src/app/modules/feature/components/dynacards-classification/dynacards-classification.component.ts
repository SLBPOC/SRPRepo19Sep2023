import { Component } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-dynacards-classification',
  templateUrl: './dynacards-classification.component.html',
  styleUrls: ['./dynacards-classification.component.scss']
})
export class DynacardsClassificationComponent {
  Highcharts: typeof Highcharts = Highcharts;

   ydata=[10,10,20,40]
  chartOptions: Highcharts.Options = {
    title:{
      text:'Dynacards Classification'
  },
    chart: {
      type: 'column',
      plotShadow: true,
      renderTo: 'container',
      backgroundColor:''
    },

    xAxis: {
      categories: ['Norm','Pump Tagging','Fluid Pound','Flatlining','GasInterFerence','HighFluidLevel','Very High Fluid Level','Others','Unknown','Distorted','NA'],
  },
                    

  
  yAxis: {
    min: 0,
    title: {
        text: 'Values'
    }
  }, 

    plotOptions: {
      column: {
          dataLabels: {
              enabled: true,
              // formatter: function () {
              //     return this.point.custom;
              // }
          },
      },
      
  },
    legend: {
      symbolHeight: 12,
      symbolWidth: 12,
      symbolRadius: 0,
    },

    series: [
       
      { 
        name: "Norm",
        data: [124],
        type: 'column',
        color: '#00FF00',
        pointWidth: 40
      },
      {
        name: "Pump Tagging",
        data: [0],
        type: 'column',
        color: '#90C3DC',
        pointWidth: 40
      },
      {
        name: 'Fluid Pound',
        data: [0],
        type: 'column',
        color: '#F06292',
        pointWidth: 40
      },
      {
        name: 'Flatlining',
        data: [0],
        type: 'column',
        color: '#3F51B5',
        pointWidth: 40
      },
      {
        name: 'GasInterFerence',
        data: [80],
        type: 'column',
        color: 'yellow',
        pointWidth: 40
      },
      {
        name: 'HighFluidLevel',
        data: [6],
        type: 'column',
        color: 'blue',
        pointWidth: 40
      },
      {
        name: 'Very High Fluid Level',
        data: [0],
        type: 'column',
        color: '#AD1457',
        pointWidth: 40
      },
      {
        name: 'Others',
        data: [0],
        type: 'column',
        color: '#AD1457',
        pointWidth: 40
      },
      {
        name: 'Unknown',
        data: [34],
        type: 'column',
        color: 'white',
        pointWidth: 40
      },
      {
        name: 'Distorted',
        data: [15],
        type: 'column',
        color: 'orange',
        pointWidth: 40
      },
      {
        name: 'NA',
        data: [0],
        type: 'column',
        color: 'red',
        pointWidth: 40
      },
    ],

    
    // series: [ 
      
      
    //   {
    //     name: "Norm",
    //     data: [{ y: 124, color: "green", }, 
               
    //           ],
             
    //     type: "column"
    //   },
      
    //   {
    //     name: "Pump Tagging",
    //     data: [10,0,12,100],
    //     color:"red" ,   
              
    //     type: "column"
    //   },
    //   {
    //     name: "Fluid Pound",
    //     data: [{ y: 0,  color: "pink" }, 
              
    //           ],
    //     type: "column"
    //   },
    //   {
    //     name: "Flatlining",
    //     data: [{ y: 0, color: "blue" }, 
              
    //           ],
    //     type: "column"
    //   },
    //   {
    //     name: "GasInterFerence",
    //     data: [{ y: 80, color: "yellow" }, 
              
    //           ],
    //     type: "column"
    //   },
    //   {
    //     name: "HighFluidLevel",
    //     data: [{ y: 6, color: "blue" }, 
              
    //           ],
    //     type: "column"
    //   },
    //   {
    //     name: "Very High Fluid Level",
    //     data: [  { y: 0, color: "black" }, 
              
    //           ],
    //     type: "column"
    //   },
    //   {
    //     name: "Others",
    //     data: [  { y: 0, color: "black" }, 
              
    //           ],
    //     type: "column"
    //   },
    //   {
    //     name: "Unknown",
    //     data: [ { y: 34, color: "black" }, 
              
    //           ],
    //     type: "column"
    //   },
    //   {
    //     name: "Distorted",
    //     data: [{ y: 15, color: "orange" }, 
              
    //           ],
    //     type: "column"
    //   },
    //   {
    //     name: "NA",
    //     data: [{y: 0, color: "black" }, 
              
    //           ],
    //     type: "column"
    //   }
      
    //   ]
  };
}
