import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidurAvodaNgComponent } from './sidur-avoda-ng.component';

describe('SidurAvodaNgComponent', () => {
  let component: SidurAvodaNgComponent;
  let fixture: ComponentFixture<SidurAvodaNgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidurAvodaNgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidurAvodaNgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
