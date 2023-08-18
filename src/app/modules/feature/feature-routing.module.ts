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
import { DynaCardComponent } from './components/dyna-card/dyna-card.component';

import { ScatterChartComponent } from './components/scatter-chart/scatter-chart.component';
import { WellInfoComponent } from './components/well-info/well-info.component';
import { WellDetailsDynacardCardDetailsComponent } from './components/well-details-dynacard/well-details-dynacard-card-details/well-details-dynacard-card-details.component';
import { WellDetailsDynacardComponent } from './components/well-details-dynacard/well-details-dynacard.component';
import { BubbleChartComponent } from './components/bubble-chart/bubble-chart.component';
import { TelemetryLineChartComponent } from './components/algorithms-and-mitigation/components/telemetry-line-chart/telemetry-line-chart.component';

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
      { path: 'alerts/:id', component: AlertListComponent },
      { path: 'event-list', component: EventListComponent },
      { path: 'wells', component: WellsComponent },
      { path: 'Parameter', component: ParChartComponent },
      {path:'well-details-dynacard',component:WellDetailsDynacardComponent},
      { path: 'wells/dyna/:id', component: WellDetailsDynacardComponent },
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
      {
        path: 'well-info/:id',
        component: WellInfoComponent,
      }, 
      {
        path: 'algorithms-and-mitigations',
        component: AlgorithmsAndMitigationComponent,
      },
      {
        path: 'telemetryChart',
        component: TelemetryLineChartComponent,
      },
    ],
  },
  { path: 'well-performance', component: WellPerformanceComponent },

  {
    path: 'scatter-chart',
    component: ScatterChartComponent,
  },
  {
    path: 'bubble-chart',
    component: BubbleChartComponent,
  }

  //   ],
  // },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeatureRoutingModule { }
