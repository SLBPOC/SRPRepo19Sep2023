import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelemetryBarChartComponent } from './telemetry-bar-chart.component';

describe('TelemetryBarChartComponent', () => {
  let component: TelemetryBarChartComponent;
  let fixture: ComponentFixture<TelemetryBarChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TelemetryBarChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TelemetryBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
