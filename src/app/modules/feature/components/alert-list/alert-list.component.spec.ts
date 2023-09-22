import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { AlertListComponent } from './alert-list.component';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { DateRange, MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HighchartsChartModule } from 'highcharts-angular';
import { FeatureRoutingModule } from '../../feature-routing.module';
import { HierarchyService } from '../../services/HierarchyService';
import { TreeViewService } from '../../services/tree-view.service';
import { WellsService } from '../../services/wells.service';
import { AlertListService } from '../../services/alert-list.service';
import { EventEmitter } from '@angular/core';


describe('AlertListComponent', () => {
  let component: AlertListComponent;
  let router: Router;
  let fixture: ComponentFixture<AlertListComponent>;
  let mockService: jasmine.SpyObj<AlertListService>; 
  let mockGetAlertListFilters: any;
  let mockDataSource: MatTableDataSource<any>;
  let mockSelectedRangeValueChange: EventEmitter<DateRange<Date>>;
  
  beforeEach(async () => {
    mockGetAlertListFilters = jasmine.createSpy('getAlertListFilters');
    mockSelectedRangeValueChange = jasmine.createSpyObj('EventEmitter', ['emit']);
    await TestBed.configureTestingModule({
      declarations: [ AlertListComponent ],
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
        
  
      ],
      providers: [
        TreeViewService,
        DatePipe,
        // ChecklistDatabase,
        HierarchyService,
        HttpClientModule,
        { provide: AlertListService, useValue: mockService },
        { provide: 'getAlertListFilters', useValue: mockGetAlertListFilters },
        { provide: MatTableDataSource, useValue: mockDataSource },
        { provide: EventEmitter, useValue: mockSelectedRangeValueChange }
      ],
      
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertListComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    mockService = jasmine.createSpyObj('AlertListService', ['getAlertListFilters']);
    mockService.getAlertListFilters.and.returnValue(of({}))
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should close the menu', () => {
    
    const mockTrigger = {
      closeMenu: jasmine.createSpy('closeMenu')
    };
    
    component.trigger = mockTrigger;
    component.closeMenu();
    expect(mockTrigger.closeMenu).toHaveBeenCalled();
  });
 
  it('should call getAlertListFilters and update WellList on response', () => {
    const searchStatus = 'someSearchStatus';
  
    const mockResponse = {
      data: [],
      totalHigh: 1,
      totalMedium: 2,
      totalLow: 3,
      totalCleared: 4
    };


    mockService.getAlertListFilters.and.returnValue(of(mockResponse));
  
  
    component.getAlertListFilters(searchStatus);
  

    expect(mockService.getAlertListFilters).toHaveBeenCalledWith(jasmine.objectContaining({
      searchStatus,
   
    }));
  
    expect(component.WellList).toEqual(mockResponse.data);
    expect(component.highCount).toEqual(mockResponse.totalHigh);
    expect(component.medCount).toEqual(mockResponse.totalMedium);
    expect(component.lowCount).toEqual(mockResponse.totalLow);
    expect(component.clearedCount).toEqual(mockResponse.totalCleared);
  });

  it('should emit close event', () => {
    
    const mockDialog = {
      close: {
        emit: jasmine.createSpy('emit')  
      }
    };
    component.closeDialog(mockDialog);
    expect(mockDialog.close.emit).toHaveBeenCalled();
  });
  it('should clear searchText and call getAlertListFilters', () => {
    component.searchText = 'some text';
    spyOn(component, 'getAlertListFilters');
    component.clearSearch();
    expect(component.searchText).toBe('');
    expect(component.getAlertListFilters).toHaveBeenCalledWith('');
  });
  it('should call resetDateRangeFilters and getAlertListFilters', () => {
    spyOn(component, 'resetDateRangeFilters');
    spyOn(component, 'getAlertListFilters');
    component.refreshFilter();
    expect(component.resetDateRangeFilters).toHaveBeenCalled();
    expect(component.getAlertListFilters).toHaveBeenCalledWith('');
  });
  it('should navigate to the well list', () => {

    spyOn(router, 'navigateByUrl');
    component.navigateToWellList();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/wells');
  });
  it('should call getAlertListFilters and closeDialog', () => {
  
    spyOn(component, 'getAlertListFilters');
    spyOn(component, 'closeDialog');
    component.submitCalendarFilters(null); 
    expect(component.getAlertListFilters).toHaveBeenCalledWith('');
    expect(component.closeDialog).toHaveBeenCalledWith(null); 
  });
  it('should update noOfDaysCalendar and call getAlertListFilters', () => {
    spyOn(component, 'getAlertListFilters');
    const mockOption = '7 days';
    component.setDateSelected(mockOption);
    expect(component.noOfDaysCalendar).toEqual(mockOption);
    expect(component.getAlertListFilters).toHaveBeenCalledWith('');
  });
  // it('should construct the correct payload and call service.snoozeBy', () => {
  //   const mockAlert = { alertId: '123' };
  //   const mockSnoozeByDialog = {

  //   };
    
  //   component.snoozeByTime = '30 minutes';

    
  //   component.submitSnoozeBy(mockAlert, mockSnoozeByDialog);

    
  //   const expectedPayload = {
  //     alertId: mockAlert.alertId,
  //     snoozeBy: '30 minutes'
  //   };

  //   expect(mockService.snoozeBy).toHaveBeenCalledWith(expectedPayload);


  // });
  // it('should set the noOfDaysCalendar property and call the getAlertListFilters() method', () => {
  //   const option = 7;

  //   component.setDateSelected(option);

  //   expect(component.noOfDaysCalendar).toBe('');
  //   expect(mockGetAlertListFilters).toHaveBeenCalledWith('');
  // });
  // it('should reset the date range filters', () => {
  //   component.resetDateRangeFilters();

  //   expect(mockDataSource.filter).toBe('');
  //   expect(component.selectedRangeValue).toEqual(new DateRange(new Date(), null));
  // });
  // it('should set the selectedRangeValue property correctly', () => {
  //   // Test case 1: `m` is null and `selectedRangeValue` is null
  //   component.selectedChange(null);

  //   expect(component.selectedRangeValue).toEqual(new DateRange(null, null));
  //   expect(mockSelectedRangeValueChange.emit).toHaveBeenCalledWith(component.selectedRangeValue);

  //   // Test case 2: `m` is a date and `selectedRangeValue` is null
  //   const startDate = new Date();

  //   component.selectedChange(startDate);

  //   expect(component.selectedRangeValue).toEqual(new DateRange(startDate, null));
  //   expect(mockSelectedRangeValueChange.emit).toHaveBeenCalledWith(component.selectedRangeValue);

  //   // Test case 3: `m` is a date and `selectedRangeValue` has a start date
  //   const endDate = new Date(startDate.getTime() + 1000);

  //   component.selectedChange(endDate);

  //   expect(component.selectedRangeValue).toEqual(new DateRange(startDate, endDate));
  //   expect(mockSelectedRangeValueChange.emit).toHaveBeenCalledWith(component.selectedRangeValue);

  //   // Test case 4: `m` is a date and `selectedRangeValue` has a start and end date
  //   const newStartDate = new Date(endDate.getTime() + 1000);

  //   component.selectedChange(newStartDate);

  //   expect(component.selectedRangeValue).toEqual(new DateRange(newStartDate, null));
  //   expect(mockSelectedRangeValueChange.emit).toHaveBeenCalledWith(component.selectedRangeValue);
  // });

});
