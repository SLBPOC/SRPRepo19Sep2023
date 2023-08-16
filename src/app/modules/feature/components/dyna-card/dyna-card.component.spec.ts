import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynaCardComponent } from './dyna-card.component';

describe('DynaCardComponent', () => {
  let component: DynaCardComponent;
  let fixture: ComponentFixture<DynaCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynaCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynaCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
