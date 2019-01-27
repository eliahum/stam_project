import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MishtanaNgComponent } from './mishtana-ng.component';

describe('MishtanaNgComponent', () => {
  let component: MishtanaNgComponent;
  let fixture: ComponentFixture<MishtanaNgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MishtanaNgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MishtanaNgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
