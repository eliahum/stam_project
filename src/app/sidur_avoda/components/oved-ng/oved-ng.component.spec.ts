import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OvedNgComponent } from './oved-ng.component';

describe('OvedNgComponent', () => {
  let component: OvedNgComponent;
  let fixture: ComponentFixture<OvedNgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OvedNgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OvedNgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
