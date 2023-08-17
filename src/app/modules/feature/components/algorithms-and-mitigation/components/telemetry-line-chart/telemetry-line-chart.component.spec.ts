import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelemetryLineChartComponent } from './telemetry-line-chart.component';

describe('TelemetryLineChartComponent', () => {
  let component: TelemetryLineChartComponent;
  let fixture: ComponentFixture<TelemetryLineChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TelemetryLineChartComponent ]
    }) 
    .compileComponents();

    fixture = TestBed.createComponent(TelemetryLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
