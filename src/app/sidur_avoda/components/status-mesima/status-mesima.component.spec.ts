import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusMesimaComponent } from './status-mesima.component';

describe('StatusMesimaComponent', () => {
  let component: StatusMesimaComponent;
  let fixture: ComponentFixture<StatusMesimaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatusMesimaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusMesimaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
