import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownForTableComponent } from './dropdown-for-table.component';

describe('DropdownForTableComponent', () => {
  let component: DropdownForTableComponent;
  let fixture: ComponentFixture<DropdownForTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DropdownForTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownForTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
