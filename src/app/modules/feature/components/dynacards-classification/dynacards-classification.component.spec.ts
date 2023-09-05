import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynacardsClassificationComponent } from './dynacards-classification.component';

describe('DynacardsClassificationComponent', () => {
  let component: DynacardsClassificationComponent;
  let fixture: ComponentFixture<DynacardsClassificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynacardsClassificationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynacardsClassificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
