import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WellFilterAndSortComponent } from './well-filter-and-sort.component';
import { MatIconModule } from '@angular/material/icon';
import { WellsComponent } from '../wells/wells.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Router } from '@angular/router';
import { MtxTooltipModule } from '@ng-matero/extensions/tooltip';
import { TreeViewService } from '../../services/tree-view.service';
import { WellsService } from '../../services/wells.service';
import { ElementRef } from '@angular/core';
import { of } from 'rxjs';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRadioModule } from '@angular/material/radio';


describe('WellFilterAndSortComponent', () => {
  let component: WellFilterAndSortComponent;
  let fixture: ComponentFixture<WellFilterAndSortComponent>;
  let mockDataService: MockDataService;
  let router: Router;
  let mockPaginator: MatPaginator;
  let mockSearchInput: ElementRef<HTMLInputElement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WellFilterAndSortComponent, WellsComponent],
      imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        MatMenuModule,
        MatCheckboxModule,
        MatPaginatorModule,
        FormsModule,
        ReactiveFormsModule,
        MatTableModule,
        MatProgressSpinnerModule,
        MtxTooltipModule,
        RouterModule,
        MatSortModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatSelectModule,
        MatSliderModule,
        MatIconModule,
        MatTabsModule,
        MatDialogModule,
        CdkAccordionModule,
        MatExpansionModule,
        MatSlideToggleModule,
        MatRadioModule
      ],
      providers: [
        TreeViewService,
        HttpClientModule, 
         {provide: WellsService, useClass: MockDataService },
        // {provide: WellsService, useClas: WellsService},
         { provide: Router}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WellFilterAndSortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should filter providers based on input', () => {
    // Arrange: Set up initial data and input value
    component.allProviders = [
      { value: 'W001' },
      { value: 'W002' },
      { value: 'W003' },
    ];
    const event = {
      target: {
        value: 'w001', 
      },
    };
    component.onInputChange(event);
    expect(component.filteredProviders).toEqual([
      { value: 'W001' },
    ]);
  });

  it('should onOpenChange', () => {
    // Arrange: Set up initial data and input value
    component.allProviders = [
      { value: 'W001' },
      { value: 'W002' },
      { value: 'W003' },
    ];
    const event = {
     
        value: 'w001', 
    
    };
    component.onOpenChange(event);
    expect(component.filteredProviders).toEqual([
      { value: 'W001' },
      { value: 'W002' },
      { value: 'W003' },
    ]);
  });

  it('should call clearAppliedFilter', () => {
    // Arrange: Set up initial data and input value
    component.allProviders = [
      { value: 'W001' },
      { value: 'W002' },
      { value: 'W003' },
    ];
    const event = {
   
        value: 'w001', 
      
    };
    component.commsStatusOptions =[
      {value: 'Comms Failed', checked: true},    
      {value: 'Comms Established', checked: true}
    ]

    component.controllerStatusOptions =
    [{value: 'Shutdown', checked: false},    
    {value: 'Hand (Manual)', checked: false},
   
    {value: 'Auto', checked: false}]

    component.pumpingTypeOptions=[
      {value: 'Over Pumping', checked: false},
      {value: 'Optimum Pumping', checked: false},
      {value: 'Under Pumping', checked: false}
    ]
    component.clearAppliedFilter();
    // expect(component.filteredProviders).toEqual([
    //   { value: 'W001' },
    //   { value: 'W002' },
    //   { value: 'W003' },
    // ]);
  });

  it('should applyFilter', () => {
    // Arrange: Set up initial data and input value
    component.allProviders = [
      { value: 'W001' },
      { value: 'W002' },
      { value: 'W003' },
    ];
    component.commsStatusOptions =[
      {value: 'Comms Failed', checked: true},    
      {value: 'Comms Established', checked: true}
    ]
    component.controllerStatusOptions =
    [{value: 'Shutdown', checked: false},    
    {value: 'Hand (Manual)', checked: false},
   
    {value: 'Auto', checked: false}]

    component.pumpingTypeOptions=[
      {value: 'Over Pumping', checked: false},
      {value: 'Optimum Pumping', checked: false},
      {value: 'Under Pumping', checked: false}
    ]
    component.applyFilter(true, "Comms Failed");
    expect(component.commsStatusOptions[0].checked).toEqual(true)
  });

  it('should applyFilter with Comms Established', () => {
    // Arrange: Set up initial data and input value
    component.allProviders = [
      { value: 'W001' },
      { value: 'W002' },
      { value: 'W003' },
    ];
    component.commsStatusOptions =[
      {value: 'Comms Failed', checked: true},    
      {value: 'Comms Established', checked: true}
    ]
    component.controllerStatusOptions =
    [{value: 'Shutdown', checked: false},    
    {value: 'Hand (Manual)', checked: false},
   
    {value: 'Auto', checked: false}]

    component.pumpingTypeOptions=[
      {value: 'Over Pumping', checked: false},
      {value: 'Optimum Pumping', checked: false},
      {value: 'Under Pumping', checked: false}
    ]
    component.applyFilter(true, "Comms Established");
    expect(component.commsStatusOptions[0].checked).toEqual(true)
  });

  it('should applyFilter with Comms Established', () => {
    // Arrange: Set up initial data and input value
    component.allProviders = [
      { value: 'W001' },
      { value: 'W002' },
      { value: 'W003' },
    ];
    component.commsStatusOptions =[
      {value: 'Comms Failed', checked: true},    
      {value: 'Comms Established', checked: true}
    ]
    component.controllerStatusOptions =
    [{value: 'Shutdown', checked: false},    
    {value: 'Hand (Manual)', checked: false},
   
    {value: 'Auto', checked: false}]

    component.pumpingTypeOptions=[
      {value: 'Over Pumping', checked: false},
      {value: 'Optimum Pumping', checked: false},
      {value: 'Under Pumping', checked: false}
    ]
    component.applyFilter(true, "Shutdown");
    expect(component.commsStatusOptions[0].checked).toEqual(true)
  });

  it('should applyFilter with Comms Established', () => {
    // Arrange: Set up initial data and input value
    component.allProviders = [
      { value: 'W001' },
      { value: 'W002' },
      { value: 'W003' },
    ];
    component.commsStatusOptions =[
      {value: 'Comms Failed', checked: true},    
      {value: 'Comms Established', checked: true}
    ]
    component.controllerStatusOptions =
    [{value: 'Shutdown', checked: false},    
    {value: 'Hand (Manual)', checked: false},
   
    {value: 'Auto', checked: false}]

    component.pumpingTypeOptions=[
      {value: 'Over Pumping', checked: false},
      {value: 'Optimum Pumping', checked: false},
      {value: 'Under Pumping', checked: false}
    ]
    component.submitAppliedFilters();
    expect(component.commsStatusOptions.length).toEqual(2)
  });


});
class MockDataService extends WellsService {
  // Override the method that makes the HTTP request
  //  search ={pageno:5, pagesize:50}
  override getWellDetailsWithFilters(welldata:{pageno, pagesize}) {
    let adata: any= {
      "data":[
        {
          "id": 1,
          "wellId": "W001",
          "wellName": "Apache 24 FED 11",
          "dateAndTime": "2023-04-14 13:14:59",
          "commStatus": "Comms Established",
          "controllerStatus": "Shutdown",
          "spm": {
            "value": 50,
            "data": [
              [ "06/09/2022", 50 ],
              [ "07/09/2022", 70 ],
              [ "08/09/2022", 100 ],
              [ "09/09/2022", 60 ],
              [ "10/09/2022", 65 ],
              [ "11/09/2022", 200 ],
              [ "12/09/2022", 100 ]
            ]
          },
          "pumpFillage": {
            "value": 55,
            "data": [
              [ "06/09/2022", 50 ],
              [ "07/09/2022", 70 ],
              [ "08/09/2022", 100 ],
              [ "09/09/2022", 60 ],
              [ "10/09/2022", 65 ],
              [ "11/09/2022", 200 ],
              [ "12/09/2022", 100 ]
            ]
          },
          "inferredProduction": {
            "value": 30.5,
            "data": [
              [ "06/09/2022", 50 ],
              [ "07/09/2022", 70 ],
              [ "08/09/2022", 100 ],
              [ "09/09/2022", 60 ],
              [ "10/09/2022", 65 ],
              [ "11/09/2022", 200 ],
              [ "12/09/2022", 100 ]
            ]
          },
          "effectiveRunTime": {
            "value": 12,
            "data": [
              [ "06/09/2022", 50 ],
              [ "07/09/2022", 70 ],
              [ "08/09/2022", 100 ],
              [ "09/09/2022", 60 ],
              [ "10/09/2022", 65 ],
              [ "11/09/2022", 200 ],
              [ "12/09/2022", 100 ]
            ]
          },
          "cyclesToday": {
            "value": 2.5,
            "data": [
              [ "06/09/2022", 50 ],
              [ "07/09/2022", 70 ],
              [ "08/09/2022", 100 ],
              [ "09/09/2022", 60 ],
              [ "10/09/2022", 65 ],
              [ "11/09/2022", 200 ],
              [ "12/09/2022", 100 ]
            ]
          },
          "structuralLoad": {
            "value": 3.5,
            "data": [
              [ "06/09/2022", 50 ],
              [ "07/09/2022", 70 ],
              [ "08/09/2022", 100 ],
              [ "09/09/2022", 60 ],
              [ "10/09/2022", 65 ],
              [ "11/09/2022", 200 ],
              [ "12/09/2022", 100 ]
            ]
          },
          "minMaxLoad": {
            "value": 20.5,
            "min": [
              [ "06/09/2022", 30 ],
              [ "07/09/2022", 50 ],
              [ "08/09/2022", 80 ],
              [ "09/09/2022", 20 ],
              [ "10/09/2022", 55 ],
              [ "11/09/2022", 100 ],
              [ "12/09/2022", 50 ]
            ],
            "max": [
              [ "06/09/2022", 50 ],
              [ "07/09/2022", 70 ],
              [ "08/09/2022", 100 ],
              [ "09/09/2022", 60 ],
              [ "10/09/2022", 65 ],
              [ "11/09/2022", 200 ],
              [ "12/09/2022", 100 ]
            ]
          },
          "gearboxLoad": {
            "value": 20.5,
            "data": [
              [ "06/09/2022", 50 ],
              [ "07/09/2022", 70 ],
              [ "08/09/2022", 100 ],
              [ "09/09/2022", 60 ],
              [ "10/09/2022", 65 ],
              [ "11/09/2022", 200 ],
              [ "12/09/2022", 100 ]
            ]
          },
          "rodStress": {
            "value": 29.5,
            "data": [
              [ "06/09/2022", 50 ],
              [ "07/09/2022", 70 ],
              [ "08/09/2022", 100 ],
              [ "09/09/2022", 60 ],
              [ "10/09/2022", 65 ],
              [ "11/09/2022", 200 ],
              [ "12/09/2022", 100 ]
            ]
          },
          "noOfAlerts": 2,
          "wellStatus": "Optimum Pumping"
        }  
      ],
      "totalCount": 1
    }
     
      
    
    return of(adata);
  }

  
}
