import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
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
import { HeatMapComponent } from './components/algorithms-and-mitigation/components/heat-map/heat-map.component';
import { TelemetryBarChartComponent } from './components/algorithms-and-mitigation/components/telemetry-bar-chart/telemetry-bar-chart.component';
import { WellInfoEntryComponent } from './components/well-details-view/well-info-entry/well-info-entry.component';
import { DynacardsClassificationComponent } from './components/dynacards-classification/dynacards-classification.component';
import { SurfaceCardPumpFillComponent } from './components/surface-card-pump-fill/surface-card-pump-fill.component';
import { CurrentCardAreaComponent } from './components/current-card-area/current-card-area.component';
import { SurfaceCardPumpComponent } from './components/surface-card-pump/surface-card-pump.component';
import { PumpFillageNoOfCycleComponent } from './components/pump-fillage-no-of-cycle/pump-fillage-no-of-cycle.component';
import { SpmMeasuredComponent } from './components/spm-measured/spm-measured.component';


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
        path: 'heat-map',
        component: HeatMapComponent,
      },
      {
        path: 'telemetryLineChart',
        component: TelemetryLineChartComponent,
      },
      {
        path: 'telemetryBarChart',
        component: TelemetryBarChartComponent,
      },
      {
        path:'well-info-v2/:id',
        component:WellInfoEntryComponent
      }
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
  },
  {
    path: 'dynaclass',
    component: DynacardsClassificationComponent,
  },
  {
    path: 'surface',
    component: SurfaceCardPumpFillComponent,
  },
  {
    path: 'current-card',
    component: CurrentCardAreaComponent,
  },
  {
    path: 'surface',
    component: SurfaceCardPumpComponent,
  },
  {
    path: 'pumpfill-chart',
    component: PumpFillageNoOfCycleComponent,
  },
  {
    path: 'spm',
    component: SpmMeasuredComponent,
  },

  //   ],
  // },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FeatureRoutingModule { }
