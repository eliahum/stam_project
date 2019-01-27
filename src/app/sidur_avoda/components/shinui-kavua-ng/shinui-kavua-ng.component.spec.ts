import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShinuiKavuaNgComponent } from './shinui-kavua-ng.component';

describe('ShinuiKavuaNgComponent', () => {
  let component: ShinuiKavuaNgComponent;
  let fixture: ComponentFixture<ShinuiKavuaNgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShinuiKavuaNgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShinuiKavuaNgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
