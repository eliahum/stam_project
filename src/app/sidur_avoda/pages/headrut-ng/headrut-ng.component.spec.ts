import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadrutNgComponent } from './headrut-ng.component';

describe('HeadrutNgComponent', () => {
  let component: HeadrutNgComponent;
  let fixture: ComponentFixture<HeadrutNgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeadrutNgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeadrutNgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
