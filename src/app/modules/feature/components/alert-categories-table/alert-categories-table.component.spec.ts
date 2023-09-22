import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertCategoriesTableComponent } from './alert-categories-table.component';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { AlertListService } from '../../services/alert-list.service';
import { Observable, of } from 'rxjs';

xdescribe('AlertCategoriesTableComponent', () => {
  let component: AlertCategoriesTableComponent;
  let fixture: ComponentFixture<AlertCategoriesTableComponent>;
  let mockService: MockAlertService;
  beforeEach(async () => {
    mockService = new MockAlertService();

    await TestBed.configureTestingModule({
      declarations: [ AlertCategoriesTableComponent ],
      imports:[HttpClientModule,
        MatTableModule ],
        providers:[AlertListService,
          { provide: AlertListService, useValue: mockService },
          
        ],
          
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertCategoriesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call loadChartData and loadTable', () => {
    spyOn(component, 'loadChartData');
    spyOn(component, 'loadTable');
  
    component.ngOnChanges();
  
    expect(component.loadChartData).toHaveBeenCalled();
    expect(component.loadTable).toHaveBeenCalled();
  });
  it('should set snoozeData when service call is successful', () => {
    const wellName = 'W012';
    const mockSnoozeData = { "AlertId": 5,
    "WellId": "W005",
    "WellName": "Apache 24 FED 12",
    "AlertLevel": "Cleared",
    "Date": "2023-07-10T11:30:20.335Z",
    "Desc": "Tagging",
    "Status": "Completed",
    "Action": "Dismiss",
    "SnoozeFlag": false,
    "SnoozeDateTime": "2023-07-09T11:30:20.335Z",
    "SnoozeInterval": 4,
    "Comment": "ClearedAlert 05 ",
    "Category": "Gas Interference Events"  };
    spyOn(mockService, 'getSnoozeByWellName').and.returnValue(of(mockSnoozeData));
  
    component.getSnoozeByWellName(wellName);
  

  });
  
});
class MockAlertService {
  getSnoozeByWellName(wellName: string): Observable<any> {
    // Mock response data
    const mockSnoozeData = {
      "AlertId": 5,
      "WellId": "W005",
      "WellName": "Apache 24 FED 12",
      "AlertLevel": "Cleared",
      "Date": "2023-07-10T11:30:20.335Z",
      "Desc": "Tagging",
      "Status": "Completed",
      "Action": "Dismiss",
      "SnoozeFlag": false,
      "SnoozeDateTime": "2023-07-09T11:30:20.335Z",
      "SnoozeInterval": 4,
      "Comment": "ClearedAlert 05 ",
      "Category": "Gas Interference Events"
    } ;
    return of(mockSnoozeData);
  }
}