import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NochechutOvedComponent } from './nochechut-oved.component';

describe('NochechutOvedComponent', () => {
  let component: NochechutOvedComponent;
  let fixture: ComponentFixture<NochechutOvedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NochechutOvedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NochechutOvedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
