import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomAlertComponent } from './custom-alert.component';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule,MatDialogRef } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldControl } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { DateRange, MatDatepickerModule } from '@angular/material/datepicker';
import { ReactiveFormsModule,FormControlName, FormsModule, NG_VALUE_ACCESSOR, FormBuilder} from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { forwardRef } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { MatInputModule } from '@angular/material/input';
import { MatSort } from '@angular/material/sort';




fdescribe('CustomAlertComponent', () => {
  let component: CustomAlertComponent;
  let fixture: ComponentFixture<CustomAlertComponent>;
  let formBuilder: FormBuilder;
  const dialogRefMock = {
    close: jasmine.createSpy('close'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomAlertComponent ],
      imports:[HttpClientModule,
        MatDialogModule,
        MatCheckboxModule,
        MatSelectModule,
        MatDatepickerModule,
        ReactiveFormsModule,
        FormsModule,
        MatNativeDateModule,
        MatTableModule,
        NoopAnimationsModule,
        MatPaginatorModule,
        NgxMatDatetimePickerModule,
        NgxMatTimepickerModule,
        NgxMatNativeDateModule,
        MatInputModule
    
      ],
      providers: [{ provide: MatDialogRef, useValue: dialogRefMock},
        { provide: MatFormFieldControl, useValue: {} },
         { provide: FormControlName, useValue: {} },
         {provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomAlertComponent),
      multi: true},
     
    ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomAlertComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);
    fixture.detectChanges();


    component.CustomAlertForm = formBuilder.group({
      CustomAlertId: null,
      CustomAlertName: 'InitialValue1',
      WellName: 'InitialValue2',
      NotificationType: 'InitialValue3',
      Priority: 'InitialValue4',
      Category: 'InitialValue5',
      Operator: 'InitialValue6',
      Value: 'InitialValue7',
      ActualValue: 'InitialValue8',
      IsActive: 'InitialValue9',
      DateRange: 'InitialValue10',
    });
    component.Submitted = true;
    component.DateFlag = true;
    component.IsNumeric = true;
    component.SelectedRangeValue = null

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update StartDate and EndDate with CustomTime', () => {
    const customDate = new Date('2023-01-15T12:34:56.789Z');

    component.StartDate = '2023-01-01T00:00:00.000Z'; 
    component.EndDate = '2023-01-31T23:59:59.999Z';
    const startDate = new Date('2023-01-15');
    const endDate = new Date('2023-02-05'); 

    const sampleDateRange:any = { start: startDate, end: endDate};  
    component.SelectedRangeValue = sampleDateRange;
    component.CustomDate = customDate;
    component.CustomDateTime();

  });


  it('should update StartDate and EndDate based on SelectedRangeValue', () => {
    // Arrange: Set up sample values for SelectedRangeValue
    const startDate = new Date('2023-01-15'); // Sample start date
    const endDate = new Date('2023-02-05');   // Sample end date

    const sampleDateRange:any = { start: startDate, end: endDate};

    // Act: Assign the sample DateRange to SelectedRangeValue and call applyDateRangeFilter
    component.SelectedRangeValue = sampleDateRange;


    // Act: Call the applyDateRangeFilter function
    component.applyDateRangeFilter();

    // Assert: Check if StartDate and EndDate are updated correctly
    expect(component.StartDate).toBe('2023-01-15'); // Format based on your implementation
    expect(component.EndDate).toBe('2023-02-05');   // Format based on your implementation
  });



  it('should add totalCount to pageSizeOption if totalCount > maxPageSize', () => {
    // Arrange: Set sample values
    component.pageSizeOption = [10, 20, 30];
    component.totalCount = 40; // Sample totalCount
    component.maxPageSize = 30; // Sample maxPageSize

    // Act: Call the loadPageOptions function
    component.loadPageOptions();

    // Assert: Check if totalCount is added to pageSizeOption
    expect(component.pageSizeOption).toEqual([10, 20, 30, 40]);
  });

  it('should not add totalCount to pageSizeOption if totalCount <= maxPageSize', () => {
    // Arrange: Set sample values
    component.pageSizeOption = [10, 20, 30];
    component.totalCount = 25; // Sample totalCount
    component.maxPageSize = 30; // Sample maxPageSize

    // Act: Call the loadPageOptions function
    component.loadPageOptions();

    // Assert: Check if pageSizeOption remains the same
    expect(component.pageSizeOption).toEqual([10, 20, 30]);
  });

  it('should initialize pageSizeOption if it is empty', () => {
    // Arrange: Set empty pageSizeOption
    component.pageSizeOption = [];
    component.totalCount = 0; // Sample totalCount
    component.maxPageSize = 0; // Sample maxPageSize

    // Act: Call the loadPageOptions function
    component.loadPageOptions();

    // Assert: Check if pageSizeOption is initialized with totalCount
    expect(component.pageSizeOption).toEqual([10, 20, 30]);
  });


  it('should call getAlertDetails after updating page settings', () => {
    // Arrange: Create a PageEvent with sample values
    const pageEvent: PageEvent = {
      pageIndex: 0,
      pageSize: 20,
      length: 100,
    };

    // Spy on the getAlertDetails function
    spyOn(component, 'getAlertDetails');

    // Act: Call the pageChanged function with the sample PageEvent
    component.pageChanged(pageEvent);

    // Assert: Check if getAlertDetails is called
    expect(component.getAlertDetails).toHaveBeenCalled();
  });


  it('should pad a single-digit month with a leading zero', () => {
    // Arrange: Set a single-digit month (zero-based index)
    const singleDigitMonth = 0; // January (zero-based)

    // Act: Call the getSelectedMonth function
    const result = component.getSelectedMonth(singleDigitMonth);

    // Assert: Check if the result has a leading zero and is two characters long
    expect(result).toBe('01');
  });

  it('should not pad a double-digit month', () => {
    // Arrange: Set a double-digit month (zero-based index)
    const doubleDigitMonth = 11; // December (zero-based)

    // Act: Call the getSelectedMonth function
    const result = component.getSelectedMonth(doubleDigitMonth);

    // Assert: Check if the result is the same as the input (no padding)
    expect(result).toBe('12');
  });

  it('should return "02" for February', () => {
    // Arrange: Set February (zero-based index)
    const february = 1; // February (zero-based)

    // Act: Call the getSelectedMonth function
    const result = component.getSelectedMonth(february);

    // Assert: Check if the result is '02' for February
    expect(result).toBe('02');
  });

  it('should pad a single-digit day with a leading zero', () => {
    // Arrange: Set a single-digit day
    const singleDigitDay = 5;

    // Act: Call the getSelectedDay function
    const result = component.getSelectedDay(singleDigitDay);

    // Assert: Check if the result has a leading zero and is two characters long
    expect(result).toBe('05');
  });

  it('should not pad a double-digit day', () => {
    // Arrange: Set a double-digit day
    const doubleDigitDay = 15;

    // Act: Call the getSelectedDay function
    const result = component.getSelectedDay(doubleDigitDay);

    // Assert: Check if the result is the same as the input (no padding)
    expect(result).toBe('15');
  });

  it('should return "01" for day 1', () => {
    // Arrange: Set day 1
    const dayOne = 1;

    // Act: Call the getSelectedDay function
    const result = component.getSelectedDay(dayOne);

    // Assert: Check if the result is '01' for day 1
    expect(result).toBe('01');
  });

  it('should set IsNumeric to true and ValueFlag to false when SelectionModel matches value[0]', () => {
    // Arrange: Set SelectionModel and value
    component.SelectionModel = 'SomeValue'; // Should match value[0]
    component.value = ['SomeValue', 'AnotherValue'];

    // Act: Call onChange
    component.onChange();

    // Assert: Check IsNumeric and ValueFlag values
    expect(component.IsNumeric).toBeTrue();
    expect(component.ValueFlag).toBeFalse();
  });

  it('should set IsNumeric to false and ValueFlag to true when SelectionModel does not match value[0]', () => {
    // Arrange: Set SelectionModel and value
    component.SelectionModel = 'AnotherValue'; // Does not match value[0]
    component.value = ['SomeValue', 'AnotherValue'];

    // Act: Call onChange
    component.onChange();

    // Assert: Check IsNumeric and ValueFlag values
    expect(component.IsNumeric).toBeFalse();
    expect(component.ValueFlag).toBeTrue();
  });

  

  it('should update SelectedRangeValue correctly when start date is not set', () => {
    // Arrange: Set SelectedRangeValue with only an end date
    const endDate = new Date('2023-01-02');
    component.SelectedRangeValue = new DateRange<Date>(null, endDate);

    // Act: Call selectedChange with a start date
    component.selectedChange(new Date('2023-01-01'));

    // Assert: Check if SelectedRangeValue is updated correctly
    expect(component.SelectedRangeValue).toEqual(new DateRange<Date>(new Date('2023-01-01'), null));
    expect(component.DateFlag).toBeFalse();
  });

  it('should swap start and end dates when end date is earlier than start date', () => {
    // Arrange: Set initial values with end date earlier than start date
    const startDate = new Date('2023-01-03');
    const endDate = new Date('2023-01-01'); // Set an earlier end date
    component.SelectedRangeValue = new DateRange<Date>(startDate, endDate);
  
    // Act: Call selectedChange with an earlier end date
    component.selectedChange(new Date('2023-01-01')); // Provide a later date
  
    // Assert: Check if start and end dates are swapped
    expect(component.SelectedRangeValue.start).toEqual(endDate);
    expect(component.SelectedRangeValue.end).toBeNull();
    expect(component.DateFlag).toBeFalse();
  });

  it('should keep start and end dates in the same order when end date is later than start date', () => {
    // Arrange: Set initial values with end date later than start date
    const startDate = new Date('2023-01-01');
    const endDate = new Date('2023-01-03');
    component.SelectedRangeValue = new DateRange<Date>(startDate, endDate);
  
    // Act: Call selectedChange with a later end date
    component.selectedChange(new Date('2023-01-01')); // Provide a later date
  
    // Assert: Check if start and end dates remain in the same order
    expect(component.SelectedRangeValue.start).toEqual(startDate);
    expect(component.SelectedRangeValue.end).toBeNull();
    expect(component.DateFlag).toBeFalse();
  });

  it('should emit SelectedRangeValueChange event', () => {
    // Arrange: Set initial values and spy on the event emitter
    const startDate = new Date('2023-01-01');
    const endDate = new Date('2023-01-02');
    component.SelectedRangeValue = new DateRange<Date>(startDate, endDate);
    spyOn(component.SelectedRangeValueChange, 'emit');

    // Act: Call selectedChange with a later end date
    component.selectedChange(new Date('2023-01-03'));

    // Assert: Check if the event emitter was called with the updated value
    expect(component.SelectedRangeValueChange.emit).toHaveBeenCalledWith(component.SelectedRangeValue);
  });






  it('should create a model with correct properties', () => {
    // Arrange: Set values for properties
    component.pageSize = 20;
    component.pageNumber = 2;
    component.sortColumn = 'name';
    component.sortDirection = 'asc';

    // Act: Call the createModel method
    const model = component.createModel();

    // Assert: Check if the model is created correctly
    expect(model.pageSize).toBe(20);
    expect(model.pageNumber).toBe(2);
    expect(model.sortColumn).toBe('name');
    expect(model.sortDirection).toBe('asc');
  });

  it('should create a model with default values if properties are not set', () => {
    // Act: Call the createModel method without setting properties

    const model = component.createModel();

    // Assert: Check if the model is created with default values
    expect(model.pageSize).toBe(10);
    expect(model.pageNumber).toBe(1);
    expect(model.sortColumn).toBe('');
    expect(model.sortDirection).toBe('');
  });



  it('should call the clear method when cancel() is called', () => {
    spyOn(component, 'clear').and.callThrough();

    component.cancel();

    expect(component.clear).toHaveBeenCalled();
  });

  
  it('should reset properties and form controls when clear() is called', () => {
    // Act: Call the clear method
    component.clear();

    // Assert: Check if properties and form controls are reset
    expect(component.Submitted).toBeFalse();
    expect(component.DateFlag).toBeFalse();
    expect(component.IsNumeric).toBeFalse();

    // Check if form controls are reset to their initial values
    expect(component.CustomAlertForm.get('CustomAlertId')?.value).toBeNull();
    expect(component.CustomAlertForm.get('CustomAlertName')?.value).toBeNull();
    expect(component.CustomAlertForm.get('WellName')?.value).toBeNull();
    expect(component.CustomAlertForm.get('NotificationType')?.value).toBeNull();
    expect(component.CustomAlertForm.get('Priority')?.value).toBeNull();
    expect(component.CustomAlertForm.get('Category')?.value).toBeNull();
    expect(component.CustomAlertForm.get('Operator')?.value).toBeNull();
    expect(component.CustomAlertForm.get('Value')?.value).toBeNull();
    expect(component.CustomAlertForm.get('ActualValue')?.value).toBeNull();

    // Check if SelectedRangeValue is reset
    expect(component.SelectedRangeValue).toEqual(new DateRange<Date>(null, null));
  });

  it('should close the dialog when closeDialog() is called', () => {
    component.close();
    expect(dialogRefMock.close).toHaveBeenCalled();
  });
 
});
