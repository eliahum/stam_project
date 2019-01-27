import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'my-base',
  template: `
      <div>
        Am I the base component: {{isBase}}?
      </div>
    `
})
export class BaseReportComponent implements OnInit {
  public dochForm: FormGroup;
  harshaa: number = 0;
  screenDisabled: boolean = false;
  onlySpecipicYechida: boolean = true;
  
  @Input() isBase: boolean = true;
  urlBase: string = "http://sql07/Reportserver_PREPRODOP/Pages/ReportViewer.aspx?%2fTavrua%2f";



  constructor(protected activatedRoute: ActivatedRoute) { 

  }
  validate(dt: Date) {
    let SIDUR_AVODA_NETUNIM_IN_ISTORIA_1: string = "כדי לצפות בנתונים מהתקופה שלפני" + " " + "2014-01-01 " + " יש לפנות למנהל.";
    if (this.dochForm.valid) {
      let start = moment("2014-01-01");
      let now = moment(dt);
      let days = now.diff(start, 'days');
      if (days < 0) return SIDUR_AVODA_NETUNIM_IN_ISTORIA_1;
      else return '';
    }
  }
  checkDiffDates(dtFrom:Date,dtTo:Date):number{
    let start = moment(dtFrom);
    let now = moment(dtTo);
    let days = now.diff(start, 'days');
    return days;
  }
  ngOnInit(): void {
    this.activatedRoute.data.forEach((data: { harshaa: any }) => {
      this.harshaa = data.harshaa;
      this.screenDisabled = (this.harshaa == 16 || this.harshaa == 64);
      this.onlySpecipicYechida = (this.harshaa == 16 || this.harshaa == 32);
    });

  }

}