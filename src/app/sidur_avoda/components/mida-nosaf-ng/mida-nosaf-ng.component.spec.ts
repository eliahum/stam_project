import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MidaNosafNgComponent } from './mida-nosaf-ng.component';

describe('TestNosafComponent', () => {
  let component: MidaNosafNgComponent;
  let fixture: ComponentFixture<MidaNosafNgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MidaNosafNgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MidaNosafNgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
