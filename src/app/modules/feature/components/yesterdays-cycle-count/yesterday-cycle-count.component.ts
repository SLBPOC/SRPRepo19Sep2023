import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { ModalContentComponent } from './components/modal-content/modal-content.component';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-yesterday-cycle-count',
  templateUrl: './yesterday-cycle-count.component.html',
  styleUrls: ['./yesterday-cycle-count.component.scss']
})
export class YesterdayCycleCountComponent implements OnInit{
  bsModalRef?: BsModalRef;
  constructor(private modalService: BsModalService, private service: DashboardService) {}
  chartData: any;

  ngOnInit(): void {
      this.service.getYesterdayCycleCountData()
      ?.subscribe((data) => {
        this.chartData = data;
        console.log('Chart data:- ', this.chartData);
      })
  }
  chartCallback: Highcharts.ChartCallbackFunction = function (chart) {
  }
  Highcharts: typeof Highcharts = Highcharts;

  chartOptions: Highcharts.Options = {
    chart: {
      //  plotBorderWidth: null,
      plotShadow: true,
      renderTo: 'container'
    },
    title: {
      text: ``,
      style: { fontSize: '16px', color: '#333' }
    },
    tooltip: {
      pointFormat: `
      <div style = "font-size: 12px; font-weight: bold; color: #333">
      Group ID: <b>({point.id})</b> 
      <br> Group Name: {point.name} 
      <br> {series.name}: <b>{point.percentage:.1f}%</b> 
      </div>
      `
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          // enabled: true, // enable true for lines around pie chart to show details
          enabled: false,
        },
        showInLegend: true,

      }
    },
    legend: {
      symbolHeight: 12,
      symbolWidth: 12,
      symbolRadius: 0
    },
    series: [{
      type: 'pie',
      name: `Yesterday's Cycle Count`,
      data: [
        {
          id: '1',
          name: 'Group 1 (0-5)',
          y: 20.0,
          sliced: false,
          selected: false,
          color: 'purple',
          events: {
            click: (e: Highcharts.PointClickEventObject) => {
              this.openModalComponent(e.point.options.id, e.point.options.name);
            }
          },
          
        },
        {
          id: '2',
          name: 'Group 2 (6-10)',
          y: 20.0,
          sliced: false,
          selected: false,
          color: 'lightgreen',
          events: {
            click: (e: Highcharts.PointClickEventObject) => {
              this.openModalComponent(e.point.options.id, e.point.options.name);
            }
          },
        },
        {
          id: '3',
          name: 'Group 3 (11-20)',
          y: 20.0,
          sliced: false,
          selected: false,
          color: 'darkblue',
          events: {
            click: (e: Highcharts.PointClickEventObject) => {
              this.openModalComponent(e.point.options.id, e.point.options.name);
            }
          },
        },
        {
          id: '4',
          name: 'Group 4 (>20)',
          y: 20.0,
          sliced: false,
          selected: false,
          color: 'pink',
          events: {
            click: (e: Highcharts.PointClickEventObject) => {
              this.openModalComponent(e.point.options.id, e.point.options.name);
            }
          },
        },
        {
          id: '5',
          name: 'N.A',
          y: 20.0,
          sliced: false,
          selected: false,
          color: 'skyblue',
          events: {
            click: (e: Highcharts.PointClickEventObject) => {
              this.openModalComponent(e.point.options.id, e.point.options.name);
            }
          },
        },

        // ['Group 3',    12.8],
        // {
        //    name: 'Group 3.5',
        //    y: 12.8,
        //    sliced: false,
        //    selected: true,
        //    color: 'darkgreen'
        // },
      ]
    }]
  };

  openModalComponent(groupId: any, groupName: any) {
    this.bsModalRef = this.modalService.show(ModalContentComponent, 
      {initialState: {
        title: 'Chart', 
        modalData: {
          groupId: groupId,
          groupName: groupName
        }
      }, 
      class: 'modal-lg'
    });
    this.bsModalRef.content.closeBtnName = 'Close';
  }

  // public openModalComponent(groupId: string) {
  //   this.bsModalRef = this.modalService.show(ModalContentComponent,
  //     {
  //       class: 'modal-lg',
  //       backdrop: 'static',
  //     });
  //   this.bsModalRef.content.groupId= groupId; //Object

  //   // this.subscriptions.push(this.modalService.onHide.subscribe((reason: string) => {
  //   //   if (this.bsModalRef.content.supervisorResponse) {
  //   //     this.unsubscribe();
  //   //   }
  //   // }));
  // }

}
