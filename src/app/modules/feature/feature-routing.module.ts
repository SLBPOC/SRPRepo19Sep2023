import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeatureComponent } from './feature.component';
import { AlgorithmsAndMitigationComponent } from './components/algorithms-and-mitigation/algorithms-and-mitigation.component';
import { WellPerformanceComponent } from './components/well-performance/well-performance.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { AlertListComponent } from './components/alert-list/alert-list.component';
import { EventListComponent } from './components/event-list/event-list.component';
import { WellsComponent } from './components/wells/wells.component';
import { CommonModule } from '@angular/common';
import { EventsRoutingModule } from '../events/events-routing.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ParChartComponent } from './components/par-chart/par-chart.component';
import { ScatterChartComponent } from './components/scatter-chart/scatter-chart.component';
const routes: Routes = [
  // {
  //   path: '',
  //   component: FeatureComponent,
  //   children: [
      {
        path: '',
        component: SidenavComponent,
        children: [
          { path: 'dashboard', component: DashboardComponent },
          { path: 'alert-list', component: AlertListComponent },
          { path: 'event-list', component: EventListComponent },
          { path: 'wells', component: WellsComponent },
          { path: 'Parameter', component: ParChartComponent },
          {
            path: 'algorithms-and-mitigations',
            component: AlgorithmsAndMitigationComponent,
          },
        ],
      },
      { path: 'well-performance', component: WellPerformanceComponent },
      // {
      //   path: 'algorithms-and-mitigations',
      //   component: AlgorithmsAndMitigationComponent,
      // },
      {
        path: 'scatter-chart',
        component: ScatterChartComponent,
      }
      
  //   ],
  // },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeatureRoutingModule {}
