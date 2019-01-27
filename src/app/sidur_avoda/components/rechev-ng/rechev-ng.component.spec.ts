import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RechevNgComponent } from './rechev-ng.component';

describe('RechevNgComponent', () => {
  let component: RechevNgComponent;
  let fixture: ComponentFixture<RechevNgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RechevNgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RechevNgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
