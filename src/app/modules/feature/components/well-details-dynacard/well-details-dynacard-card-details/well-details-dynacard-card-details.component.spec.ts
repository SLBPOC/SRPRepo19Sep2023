import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WellDetailsDynacardCardDetailsComponent } from './well-details-dynacard-card-details.component';

describe('WellDetailsDynacardCardDetailsComponent', () => {
  let component: WellDetailsDynacardCardDetailsComponent;
  let fixture: ComponentFixture<WellDetailsDynacardCardDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WellDetailsDynacardCardDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WellDetailsDynacardCardDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
