import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatureRoutingModule } from './feature-routing.module';
import { FeatureComponent } from './feature.component';
import { AlgorithmsAndMitigationComponent } from './components/algorithms-and-mitigation/algorithms-and-mitigation.component';
import { WellListComponent } from './components/well-list/well-list.component';
import { WellPerformanceComponent } from './components/well-performance/well-performance.component';
import { YesterdayCycleCountComponent } from './components/yesterdays-cycle-count/yesterday-cycle-count.component';
import { YesterdayPercentRunComponent } from './components/yesterday-percent-run/yesterday-percent-run.component';
import { ClassificationSummaryComponent } from './components/classification-summary/classification-summary.component';
import { ParameterChartComponent } from './components/parameter-chart/parameter-chart.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ModalContentComponent } from './components/yesterdays-cycle-count/components/modal-content/modal-content.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { BsModalService} from 'ngx-bootstrap/modal';
import { YesterdayCycleBarChartComponent } from './components/yesterdays-cycle-count/components/yesterday-cycle-bar-chart/yesterday-cycle-bar-chart.component';
import {HttpClientModule} from '@angular/common/http'
import { SaveTreeStateDialog, WellTreeSearchComponent } from './components/well-list/well-tree-search/well-tree-search.component';
import { WellTreeView } from './components/well-list/well-tree-view/well-tree-view.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTreeModule } from '@angular/material/tree';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardAlertsComponent } from './components/dashboard-alerts/dashboard-alerts.component';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { DatePipe, NgIf } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';

@NgModule({
  declarations: [
    FeatureComponent,
    AlgorithmsAndMitigationComponent,
    WellListComponent,
    WellPerformanceComponent,
    YesterdayCycleCountComponent,
    YesterdayPercentRunComponent,
    ClassificationSummaryComponent,
    ParameterChartComponent,
    DashboardComponent,
    ParameterChartComponent,
    ModalContentComponent,
    YesterdayCycleBarChartComponent,
    WellTreeSearchComponent,
    SaveTreeStateDialog,
    WellTreeView,
    DashboardAlertsComponent
  ],
  imports: [
    CommonModule,
    FeatureRoutingModule,
    HighchartsChartModule,
    FormsModule,
    HttpClientModule,
    HttpClientModule,
    MatTreeModule,
    MatCheckboxModule,
    MatIconModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatButtonModule,
    MatDialogModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    DragDropModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  entryComponents: [ModalContentComponent],
  providers: [BsModalService]

})
export class FeatureModule { }
