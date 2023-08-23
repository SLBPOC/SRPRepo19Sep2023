import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlidingTabsComponent } from './sliding-tabs.component';

describe('SlidingTabsComponent', () => {
  let component: SlidingTabsComponent;
  let fixture: ComponentFixture<SlidingTabsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SlidingTabsComponent]
    });
    fixture = TestBed.createComponent(SlidingTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
