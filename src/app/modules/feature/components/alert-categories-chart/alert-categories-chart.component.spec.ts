import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertCategoriesChartComponent } from './alert-categories-chart.component';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';

xdescribe('AlertCategoriesChartComponent', () => {
  let component: AlertCategoriesChartComponent;
  let fixture: ComponentFixture<AlertCategoriesChartComponent>;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlertCategoriesChartComponent ],
      imports:[HighchartsChartModule],
      providers:[ { provide: Highcharts, useValue: mockHighcharts },]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertCategoriesChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
const mockHighcharts = {
  chart: {
    xAxis: [{ categories: ['Category1', 'Category2', 'Category3'] }],
  },
};

