import { Component } from '@angular/core';
import { EventEmitter, Input, Output, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DateRange } from '@angular/material/datepicker';
import { MatTableDataSource } from '@angular/material/table';
interface Food {
    value: string;
    viewValue: string;
  }
  export interface PeriodicElement {
    select: string;
    card: string;
    time: string;
    Minimum_Polished_Rod_Load: string;
    Peak_Polished_Rod: string;
  }
  const ELEMENT_DATA: PeriodicElement[] = [
    { select: '', card: 'Pump Tagging', time: '2020-04-14 13:14:59', Minimum_Polished_Rod_Load: '17,829 lbs', Peak_Polished_Rod:'30,314 lbs' },
    { select: '', card: 'Pump Tagging', time: '2020-04-14 13:14:59', Minimum_Polished_Rod_Load: '17,829 lbs', Peak_Polished_Rod:'30,314 lbs' },
    { select: '', card: 'Pump Tagging', time: '2020-04-14 13:14:59', Minimum_Polished_Rod_Load: '17,829 lbs', Peak_Polished_Rod:'30,314 lbs' },
    { select: '', card: 'Pump Tagging', time: '2020-04-14 13:14:59', Minimum_Polished_Rod_Load: '17,829 lbs', Peak_Polished_Rod:'30,314 lbs' },
    { select: '', card: 'Pump Tagging', time: '2020-04-14 13:14:59', Minimum_Polished_Rod_Load: '17,829 lbs', Peak_Polished_Rod:'30,314 lbs' },
    { select: '', card: 'Pump Tagging', time: '2020-04-14 13:14:59', Minimum_Polished_Rod_Load: '17,829 lbs', Peak_Polished_Rod:'30,314 lbs' },
    { select: '', card: 'Pump Tagging', time: '2020-04-14 13:14:59', Minimum_Polished_Rod_Load: '17,829 lbs', Peak_Polished_Rod:'30,314 lbs' },
    { select: '', card: 'Pump Tagging', time: '2020-04-14 13:14:59', Minimum_Polished_Rod_Load: '17,829 lbs', Peak_Polished_Rod:'30,314 lbs' },
  ];
@Component({
  selector: 'app-wellinfo-dynacard',
  templateUrl: './wellinfo-dynacard.component.html',
  styleUrls: ['./wellinfo-dynacard.component.scss'],
  
 
})

export class WellinfoDynacardComponent {
  displayedColumns: string[] = ['select', 'card', 'time', 'Minimum_Polished_Rod_Load','Peak_Polished_Rod'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  foods: Food[] = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'},
  ];

  ///////////////////////////////////////////////
  // toppings = this._formBuilder.group({
  //   EffectiveRunTime: false,
  //   CyclesToday: false,
  //   StructuralLoad: false,
  //   MinMaxLoad: false,
  //   GearboxLoad: false,
  //   RodStress: false
  // });
  constructor(private _formBuilder: FormBuilder) {}
}
