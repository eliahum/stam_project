import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HearatSidurComponent } from './hearat-sidur.component';

describe('HearatSidurComponent', () => {
  let component: HearatSidurComponent;
  let fixture: ComponentFixture<HearatSidurComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HearatSidurComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HearatSidurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
