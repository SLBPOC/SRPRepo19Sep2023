import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WellListRoutingModule } from './well-list-routing.module';
import { WellListComponent } from './well-list.component';
import { AlgorithmsAndMitigationComponent } from './components/algorithms-and-mitigation/algorithms-and-mitigation.component';


@NgModule({
  declarations: [
    WellListComponent,
    AlgorithmsAndMitigationComponent
  ],
  imports: [
    CommonModule,
    WellListRoutingModule
  ]
})
export class WellListModule { }
