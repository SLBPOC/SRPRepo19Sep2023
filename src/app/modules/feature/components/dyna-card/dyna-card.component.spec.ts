import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DynaCardComponent } from './dyna-card.component';
import { DynacardService } from '../../services/dynacard.service';
import { DynaCardModel, DynacardModel2 } from '../../model/dyna-card.model';
import * as d3 from 'd3';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { ListOfTimeComponent } from '../list-of-time/list-of-time.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

fdescribe('DynaCardComponent', () => {
  let component: DynaCardComponent;
  let fixture: ComponentFixture<DynaCardComponent>;
  let service: DynacardService
  let mockDataService: MockDataService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynaCardComponent,ListOfTimeComponent ],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        HttpClientTestingModule,
        HighchartsChartModule
      ],
      
      providers: [
        
        {provide: DynacardService, useClass: mockDataService },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynaCardComponent);
    component = fixture.componentInstance;
    mockDataService = TestBed.inject(DynacardService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  // it('should add series to options.series when addedOrRemoved is true', () => {
  //   // Arrange
  //   const dynacard: DynacardModel2 = [
  //    { id: 1, // Include the 'id' property
  //     downhole_Card_Position: 1,
  //     downhole_Card_Load: 10,
  //     surface_Card_Position: 2,
  //     surface_Card_Load: 20,
  //     surface_Card: 'Some value', // Include 'surface_Card' and other required properties
  //     surface_Card_Time: 'Some time value',
  //     downhole_Card: 'Some downhole value',},
  //     // Include other required properties
  //   ];

  //   const addedOrRemoved = true;
  //   const name = 'TestName';

  //   // Act
  //   component.updateInHighChartv2(dynacard, addedOrRemoved, name);

  //   // Assert
  //   const addedSeriesDownhole = component.options.series.find(series => series.id === name + '-downhole');
  //   const addedSeriesSurface = component.options.series.find(series => series.id === name + '-surface');

  //   expect(addedSeriesDownhole).toBeTruthy();
  //   expect(addedSeriesSurface).toBeTruthy();

  //   // You can add more assertions as needed
  // });

  // it('should remove series from options.series when addedOrRemoved is false', () => {
  //   // Arrange
  //   const addedOrRemoved = false;
  //   const name = 'TestName';

  //   // Act
  //   component.updateInHighChartv2([], addedOrRemoved, name);

  //   // Assert
  //   const removedSeriesDownhole = component.options.series.find(series => series.id === name + '-downhole');
  //   const removedSeriesSurface = component.options.series.find(series => series.id === name + '-surface');

  //   expect(removedSeriesDownhole).toBeFalsy();
  //   expect(removedSeriesSurface).toBeFalsy();

  //   // You can add more assertions as needed
  // });

  // it('should call dynaService.getDynaCardDetailsForATime when addedOrRemoved is true', () => {
  //   // Arrange
  //   const selectedTime = { addedOrRemoved: true, selected: 'SomeTime' };
  //   spyOn(component, 'getDynaCardDetailsForATime').and.returnValue(of([]));
  
  //   // Act
  //   component.ngOnInit();
  //   component.selectedTime.next(selectedTime); // Trigger the observable
  
  //   // Assert
  //   expect(component.getDynaCardDetailsForATime).toHaveBeenCalledWith(selectedTime.selected);
  //   // You can add more assertions as needed
  // });
  
});
class MockDataService extends DynacardService {
  // Override the method that makes the HTTP request
  //  search ={pageno:5, pagesize:50}
  // override getWellInfoById(abcd: any) {
  //   let adata: any= {
  //     "data":[
  //   {label: 'Current SPM ', value: '5.5 spm'},
  //   {label: 'Pump Fillage', value: '94.5'},
  //   {label: 'Well State', value: 'Pumping Normal State'},
  //   {label: 'Pump Card DiagnisStics ', value: 'Narmal'},
  //   {label: 'inferred prod', value: '278.0 bbls/day'},
  //     ],
  //     "totalCount": 1
  //   }
     
      
    
  //   return of(adata);
  // }

  
}
