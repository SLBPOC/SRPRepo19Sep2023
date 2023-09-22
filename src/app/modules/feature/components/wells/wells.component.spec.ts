import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';

import { WellsComponent } from './wells.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { WellsService } from '../../services/wells.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Observable, of } from 'rxjs';
import { Component } from '@angular/core';
import { MtxTooltipModule } from '@ng-matero/extensions/tooltip';
import { Router, RouterModule } from '@angular/router';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { ElementRef } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, tap } from 'rxjs/operators';
import { WellFilterAndSortComponent } from '../well-filter-and-sort/well-filter-and-sort.component';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { WellModel } from '../../model/wellModel';
import { TreeViewService } from '../../services/tree-view.service';
import { CommonModule, DatePipe } from '@angular/common';
import { ErrorComponent } from 'src/app/core/error/error.component';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { BrowserModule } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { HighchartsChartModule } from 'highcharts-angular';
import { FeatureRoutingModule } from '../../feature-routing.module';
import { WellTreeSearchComponent } from '../well-tree-list/well-tree-search/well-tree-search.component';
import { WellTreeListComponent } from '../well-tree-list/well-tree-list.component';
import { WellTreeView } from '../well-tree-list/well-tree-view/well-tree-view.component';
import { HierarchyService } from '../../services/HierarchyService';


xdescribe('WellsComponent', () => {
  let component: WellsComponent;
  let fixture: ComponentFixture<WellsComponent>;
  let mockDataService: MockDataService;
  let router: Router;
  let mockPaginator: MatPaginator;
  let mockSearchInput: ElementRef<HTMLInputElement>;
  

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [         
        WellsComponent,
        WellFilterAndSortComponent,
        ErrorComponent,
        WellTreeListComponent,
        WellTreeSearchComponent,
        WellTreeView],
      
      imports: [
        HttpClientModule,
        BrowserAnimationsModule,
        BrowserModule,
        CommonModule,
        MatIconModule,
        MatTabsModule,
        MatDialogModule,
        FormsModule,
        ReactiveFormsModule,
        FormsModule,
        MatMenuModule,
        MatPaginatorModule,
        CdkAccordionModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatSelectModule,
        MatSliderModule,
        MatSlideToggleModule,
        MatRadioModule,
        MatTreeModule,
        MatCheckboxModule,
        MatTableModule,
        RouterTestingModule.withRoutes([]),
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
        MatSlideToggleModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatTooltipModule,
        MatCardModule,
        MatButtonModule,
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
        MtxTooltipModule
      ],
      providers: [
        TreeViewService,
        DatePipe,
        HttpClientModule, 
        HierarchyService,
         {provide: WellsService, useClass: MockDataService },
        // {provide: WellsService, useClas: WellsService},
         { provide: Router, useValue: router }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WellsComponent);
    component = fixture.debugElement.componentInstance;
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    //mockDataService = TestBed.inject(WellsService);
    fixture.detectChanges();

    router = TestBed.inject(Router);
    mockPaginator = jasmine.createSpyObj('MatPaginator', ['']);
    mockSearchInput = {
      nativeElement: jasmine.createSpyObj('HTMLInputElement', ['']),
    };

    // Set the mocks on the component instance
    component.dataSource = jasmine.createSpyObj('MatTableDataSource', ['']);
    component.paginator = mockPaginator;
    component.searchInput = mockSearchInput;
  });
  
  

  it('should create', () => {
    expect(component).toBeTruthy();
  });

//   fit('should call RefreshGrid', () => {
//     fixture.detectChanges()
//     component.RefreshGrid()
//    expect(component.searchText).toEqual("");
//  });

  // it('should call RefreshGrid', () => {
  //   component.RefreshGrid()
  //   expect(component.searchText).toEqual("");
  // });
  // xit('should call onSortChanged', () => {
  //   // component.sort = {direction: "asc"}
  //   component.onSortChanged("")
  //   expect(component.GetWellDetailsWithFilters).toBeTruthy();
  //   expect(component.pageNumber).toEqual(1)
  // });

  //   it('should call SeachByStatus', () => {
  //   // component.sort = {direction: "asc"}
  //   component.SeachByStatus("")
  //   expect(component.GetWellDetailsWithFilters).toBeTruthy();
  //   expect(component.pageNumber).toEqual(1)
  // });

  // it('should call ClearSearch', () => {
  //   component.ClearSearch()
  //   fixture.detectChanges()
  //   // expect(workService.getworklist).toHaveBeenCalled();
  //   expect(component.ClearSearch).toBeTruthy();
  // });

  // xit('onChangeDemo', () => {
  //   const mockEvent = { checked: true, source: { value: 'ColumnValue' } };
  //   component.extraColumnsList = [
  //     { label: 'Label1', accessor: 'Accessor1', header: 'Header1' },
  //     // ... other mock extraColumns
  //   ];
  
  //   component.onChangeDemo(mockEvent);
  
  //   // Add your expectations here
  // });
  // xit('onChangeDemo', () => {
  //   const mockEvent = { checked: false, source: { value: 'ColumnValue' } };
  //   component.extraColumnsList = [
  //     { label: 'Label1', accessor: 'Accessor1', header: 'Header1' },
  //     // ... other mock extraColumns
  //   ];
  
  //   component.onChangeDemo(mockEvent);
  
  //   // Add your expectations here
  // });
  
  // fit('should handle undefined sort.active', () => {
  //   const event: PageEvent = {
  //     pageIndex: 0,
  //     pageSize: 0,
  //     length: 0,
  //   };
  //   const mockSort: MatSort = { direction: 'asc' } as MatSort;
  //   component.sort = mockSort;
  
  //   // spyOn(component, 'GetWellDetailsWithFilters');
  
  //   component.handlePage(event);
  
  //   expect(component.sortColumn).toEqual('');
  //   // expect(component.GetWellDetailsWithFilters).toHaveBeenCalled();
  // });
  // fit('should handle undefined sort.active', () => {
  //   const event: PageEvent = {
  //     pageIndex: 0,
  //     pageSize: 0,
  //     length: 0,
  //   };
  //   const mockSort: MatSort = { direction: 'asc' } as MatSort;
  //   component.sort = mockSort;
  
  //   // spyOn(component, 'GetWellDetailsWithFilters');
  
  //   component.pageChanged(event);
  
  //   expect(component.sortColumn).toEqual('');
  //   // expect(component.GetWellDetailsWithFilters).toHaveBeenCalled();
  // });
  it('should create and return a model with provided values', () => {
    
    component.pageSize = 10;
    component.pageNumber = 2;
    component.searchText = 'search query';
    component.sortColumn = 'columnName';
    component.sortDirection = 'asc';
    component.seachByStatus = 'statusValue';
  
    const result = component.createModel();
    fixture.detectChanges()
  
    expect(result.pageSize).toEqual(component.pageSize);
    expect(result.pageNumber).toEqual(component.pageNumber);
    expect(result.searchText).toEqual(component.searchText);
    expect(result.sortColumn).toEqual(component.sortColumn);
    expect(result.sortDirection).toEqual(component.sortDirection);
    expect(result.searchStatus).toEqual(component.seachByStatus);
  });

  // it('should set component properties', () => {
  //   const mockResponse: WellModel[] = [/* mock well data */];
    
  //   // Mock the service method
  //   WellsComponent.getWellDetails.and.returnValue(of(mockResponse));

  //   // Call your method
  //   component.GetWellDetails();

  //   // Expectations
  //   expect(component.loading).toBe(true);
  //   expect(WellsComponent.getWellDetails).toHaveBeenCalled();

  //   // Simulate the response from the service
  //   fixture.detectChanges(); // Trigger change detection
  //   expect(component.loading).toBe(false);
  //   expect(component.WellList).toEqual(mockResponse);
  //   // You may also want to test other aspects of the method like MatTableDataSource, paginator, and sort.
  // });
});



class MockDataService extends WellsService {
  // Override the method that makes the HTTP request
  //  search ={pageno:5, pagesize:50}
  override getWellDetailsWithFilters(welldata:{pageno, pagesize}) {
    let adata: any= {
      "wellDtos":[
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
      "pumpingDetails":{
        "optimalPumping":71,
        "overPumping": 48,
        "totalCount": 151
      },
      "totalCount": 1
    }
     
      
    
    return of(adata);
  }

  
}