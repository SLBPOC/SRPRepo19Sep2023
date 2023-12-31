import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatureRoutingModule } from './feature-routing.module';
import { FeatureComponent } from './feature.component';
import { AlgorithmsAndMitigationComponent } from './components/algorithms-and-mitigation/algorithms-and-mitigation.component';
import { WellTreeListComponent } from './components/well-tree-list/well-tree-list.component';
import { WellPerformanceComponent } from './components/well-performance/well-performance.component';
import { YesterdayCycleCountComponent } from './components/yesterdays-cycle-count/yesterday-cycle-count.component';
import { YesterdayPercentRunComponent } from './components/yesterday-percent-run/yesterday-percent-run.component';
import { ClassificationSummaryComponent } from './components/classification-summary/classification-summary.component';
import { ParameterChartComponent } from './components/parameter-chart/parameter-chart.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ModalContentComponent } from './components/yesterdays-cycle-count/components/modal-content/modal-content.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { BsModalService } from 'ngx-bootstrap/modal';
import { YesterdayCycleBarChartComponent } from './components/yesterdays-cycle-count/components/yesterday-cycle-bar-chart/yesterday-cycle-bar-chart.component';
import { HttpClientModule } from '@angular/common/http';
import {
  SaveTreeStateDialog,
  WellTreeSearchComponent,
} from './components/well-tree-list/well-tree-search/well-tree-search.component';
import { WellTreeView } from './components/well-tree-list/well-tree-view/well-tree-view.component';
import { HierarchyService } from './services/HierarchyService';
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
import { MatSortModule, MatSort, Sort } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { DatePipe, NgIf } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';

// UI
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatGridListModule } from '@angular/material/grid-list';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { AlertListComponent } from './components/alert-list/alert-list.component';
import { EventListComponent } from './components/event-list/event-list.component';
import { WellsComponent } from './components/wells/wells.component';
import { ParChartComponent } from './components/par-chart/par-chart.component';
// import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { MtxTooltipModule } from '@ng-matero/extensions/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { AlgoLineChartComponent } from './components/algorithms-and-mitigation/components/algo-line-chart/algo-line-chart.component';
import { WellViewParametersComponent } from './components/well-view-parameters/well-view-parameters.component';
import { TreeViewService } from './services/tree-view.service';
import { NavigationComponent } from './components/navigation/navigation.component';
import { AlgoFilterComponent } from './components/algorithms-and-mitigation/components/algo-filter/algo-filter.component';
import { DynaCardComponent } from './components/dyna-card/dyna-card.component';
import { ScatterChartComponent } from './components/scatter-chart/scatter-chart.component';
import { DynacardService } from './services/dynacard.service';
import { ListOfTimeComponent } from './components/list-of-time/list-of-time.component';
import { WellInfoComponent } from './components/well-info/well-info.component';
import { CreateCustomFeedComponent } from './components/well-info/create-custom-feed/create-custom-feed.component';
//Dynacard
import { WellDetailsDynacardComponent } from './components/well-details-dynacard/well-details-dynacard.component';
import { WellDetailsDynacardBarchartComponent } from './components/well-details-dynacard/components/well-details-dynacard-barchart/well-details-dynacard-barchart.component';
import { WellDetailsDynacardCardTableComponent } from './components/well-details-dynacard/well-details-dynacard-card-table/well-details-dynacard-card-table.component';
import { WellDetailsDynacardCardDetailsComponent } from './components/well-details-dynacard/well-details-dynacard-card-details/well-details-dynacard-card-details.component';
import { WellDetailsDynacardCardLegendComponent } from './components/well-details-dynacard/well-details-dynacard-card-legend/well-details-dynacard-card-legend.component';
import { WellDetailsDynacardCardDatagridComponent } from './components/well-details-dynacard/well-details-dynacard-card-datagrid/well-details-dynacard-card-datagrid.component';
import { WellDetailsDynacardViewDataComponent } from './components/well-details-dynacard/well-details-dynacard-view-data/well-details-dynacard-view-data.component';
import { WellDetailsDynacardViewGraphComponent } from './components/well-details-dynacard/well-details-dynacard-view-graph/well-details-dynacard-view-graph.component';
import { DynacardChipsComponent } from './components/well-details-dynacard/dynacard-chips/dynacard-chips.component';
import { TelemetryLineChartComponent } from './components/algorithms-and-mitigation/components/telemetry-line-chart/telemetry-line-chart.component';
import { WellInfoImageDescriptionComponent } from './components/well-info-image-description/well-info-image-description.component';
import { AlgorithmsAndMitigationsService } from './services/algorithms-and-mitigations.service';
import { HeatMapComponent } from './components/algorithms-and-mitigation/components/heat-map/heat-map.component';
import { TelemetryBarChartComponent } from './components/algorithms-and-mitigation/components/telemetry-bar-chart/telemetry-bar-chart.component';
import { WellInfoEntryComponent } from './components/well-details-view/well-info-entry/well-info-entry.component';
import { AlgorithmitiInnertabsComponent } from './components/well-details-view/algorithmiti-innertabs/algorithmiti-innertabs.component';
import { CreateGatewayInnertabsComponent } from './components/well-details-view/create-gateway-innertabs/create-gateway-innertabs.component';
import { GenericTabsComponent } from './components/well-details-view/generic-tabs/generic-tabs.component';
import { SlbAccordionComponent } from './components/well-details-view/slb-accordion/slb-accordion.component';
import { WellInfoAlertsComponent } from './components/well-details-view/well-info-alerts/well-info-alerts.component';
import { WellInfoEventsComponent } from './components/well-details-view/well-info-events/well-info-events.component';
import { WellinfoDynacardComponent } from './components/well-details-view/wellinfo-dynacard/wellinfo-dynacard.component';
import { AlgomitFiltertabsComponent } from './components/well-details-view/algomit-filtertabs/algomit-filtertabs.component';
import { WellFilterAndSortComponent } from './components/well-filter-and-sort/well-filter-and-sort.component';
import {MatSliderModule} from '@angular/material/slider';
import { CurrentCardAreaComponent } from './components/current-card-area/current-card-area.component';
import { SpmMeasuredComponent } from './components/spm-measured/spm-measured.component';
import { PumpFillageNoOfCycleComponent } from './components/pump-fillage-no-of-cycle/pump-fillage-no-of-cycle.component';
import { StylePaginatorDirective } from './components/wells/wells-dierctives';
import { SurfaceCardPumpComponent } from './components/surface-card-pump/surface-card-pump.component';
import { DynacardsClassificationComponent } from './components/dynacards-classification/dynacards-classification.component';
import { SurfaceCardPumpFillComponent } from './components/surface-card-pump-fill/surface-card-pump-fill.component';
import { AlertsSrpComponent } from './components/alerts-srp/alerts-srp.component';
import { AlertsExpandableListComponent } from './components/alerts-srp/components/alerts-expandable-list.component';
import { CustomAlertComponent } from './components/custom-alert/custom-alert.component';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { AlertCategoriesChartComponent } from './components/alert-categories-chart/alert-categories-chart.component';
import { AlertCategoriesTableComponent } from './components/alert-categories-table/alert-categories-table.component';
import { ErrorComponent } from 'src/app/core/error/error.component';
import { UiDynacardInfoComponent } from './components/ui-dynacard-info/ui-dynacard-info.component';


@NgModule({
  declarations: [
    FeatureComponent,
    AlgorithmsAndMitigationComponent,
    WellTreeListComponent,
    WellPerformanceComponent,
    YesterdayCycleCountComponent,
    YesterdayPercentRunComponent,
    ClassificationSummaryComponent,
    ParameterChartComponent,
    ParameterChartComponent,
    ModalContentComponent,
    YesterdayCycleBarChartComponent,
    WellTreeSearchComponent,
    SaveTreeStateDialog,
    WellTreeView,
    DashboardAlertsComponent,
    SidenavComponent,
    AlertListComponent,
    EventListComponent,
    WellsComponent,
    AlgoLineChartComponent,
    ParChartComponent,
    WellViewParametersComponent,
    DashboardComponent,
    NavigationComponent,
    AlgoFilterComponent,
    DynaCardComponent,
    ScatterChartComponent,
    ListOfTimeComponent,
    WellInfoComponent,
    CreateCustomFeedComponent,
    WellDetailsDynacardComponent,
    WellDetailsDynacardBarchartComponent,
    WellDetailsDynacardCardTableComponent,
    WellDetailsDynacardCardDetailsComponent,
    WellDetailsDynacardCardLegendComponent,
    WellDetailsDynacardCardDatagridComponent,
    WellDetailsDynacardViewDataComponent,
    WellDetailsDynacardViewGraphComponent,
    DynacardChipsComponent,
    TelemetryLineChartComponent,
    WellInfoImageDescriptionComponent,
    HeatMapComponent,
    TelemetryBarChartComponent,
    /// well detail view
    WellInfoEntryComponent,
    AlgorithmitiInnertabsComponent,
    CreateGatewayInnertabsComponent,
    GenericTabsComponent,
    SlbAccordionComponent,
    WellInfoAlertsComponent,
    WellInfoEventsComponent,
    WellinfoDynacardComponent,
    AlgomitFiltertabsComponent,
    WellFilterAndSortComponent,
    /// well detail view end
    DynacardsClassificationComponent,
    SurfaceCardPumpFillComponent,
    CurrentCardAreaComponent,
    SurfaceCardPumpComponent,
    PumpFillageNoOfCycleComponent,
    SpmMeasuredComponent,
    StylePaginatorDirective,
    AlertsSrpComponent,
    AlertsExpandableListComponent,
    CustomAlertComponent,
    AlertCategoriesChartComponent,
    AlertCategoriesTableComponent,
    //httperrors
    ErrorComponent,
    UiDynacardInfoComponent
    
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
    MatNativeDateModule,
    MatTooltipModule,
    MatCardModule,
    MatButtonModule,
    MtxTooltipModule,

    // UI
    MatSidenavModule,
    MatTabsModule,
    MatListModule,
    MatGridListModule,
    MatToolbarModule,
    MatExpansionModule,
    MatToolbarModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatSliderModule,

    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
  ],
  providers: [BsModalService,
    HierarchyService,
    TreeViewService,
    DynacardService,
    AlgorithmsAndMitigationsService
  ],
})
export class FeatureModule { }
