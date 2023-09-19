import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentCardAreaComponent } from './current-card-area.component';

describe('CurrentCardAreaComponent', () => {
  let component: CurrentCardAreaComponent;
  let fixture: ComponentFixture<CurrentCardAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrentCardAreaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrentCardAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
