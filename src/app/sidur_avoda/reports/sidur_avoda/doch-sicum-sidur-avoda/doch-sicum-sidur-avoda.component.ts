import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { FormBuilder,  Validators } from '@angular/forms';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { UserDataService } from 'src/app/shared/services/user-data.service';
import * as moment from 'moment';

import { ActivatedRoute } from '@angular/router';
import { BaseReportComponent } from '../../base-report-component';
import { IYechidaIrgunit } from 'src/app/sidur_avoda';


@Component({
  selector: 'app-doch-sicum-sidur-avoda',
  templateUrl: './doch-sicum-sidur-avoda.component.html',
  styleUrls: ['./doch-sicum-sidur-avoda.component.scss']
})

export class DochSicumSidurAvodaComponent extends BaseReportComponent implements OnInit {
  public sugeiMesimot: Array<{ text: string, value: number }> = [
    { text: "קבועה", value: 18 },
    { text: "משתנה", value: 20 }
  ];

  public sugMesima: { text: string, value: number } = { text: "קבועה", value: 18 };

  reportName: string = "tvr_r_sicom_sidur_avoda";
  globalUrl: string = this.urlBase + this.reportName + "&rs:Command=Render&rc:Parameters=false&";
  url: SafeResourceUrl;
  dtDate: Date;
  KodYechidaMevazaat: number;
  IdYechidaMevatzat: number;
  constructor(public sanitizer: DomSanitizer, public userData: UserDataService,
    private messageService: MessageService,
    private fb: FormBuilder,protected activatedRoute: ActivatedRoute
  ) {
    super(activatedRoute);
    this.dtDate = this.userData.Today;
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl("");
    this.KodYechidaMevazaat = this.userData.KodYechidaMevatzat;
    this.IdYechidaMevatzat = this.userData.IdYechidaMevatzat;
  }
  OnYechidaMevazaatChanged({ yechidaData, action, parentrow }) {

    if (action != 'init') {
      this.KodYechidaMevazaat = Number(yechidaData.kod_yechida);
      this.IdYechidaMevatzat = Number(yechidaData.id_yechida);
    }
  }
  OnCloseYechidaMevazaat(row: IYechidaIrgunit) {

    if (row != 'empty') {
      //this.userData.KodYechidaMevatzat = Number(row.kod_yechida);
      //this.userData.IdYechidaMevatzat = row.id_yechida;
    }
  }
  public OnPrevDateClick() {
    this.dochForm.controls.dtDate.setValue(new Date(moment(this.dochForm.controls.dtDate.value).add(-1, 'day').format("MM/DD/YYYY")));
  }
  public OnNextDateClick() {
    this.dochForm.controls.dtDate.setValue(new Date(moment(this.dochForm.controls.dtDate.value).add(1, 'day').format("MM/DD/YYYY")));

  }

  ngOnInit() {
    super.ngOnInit();
    this.dochForm = this.fb.group({
      'dtDate': [this.dtDate, Validators.required],
      'sugMesima': [this.sugMesima]
    });
  }
  OnHazeg() {


    let validResult = super.validate(this.dochForm.controls.dtDate.value);
    if (this.dochForm.valid) {
      if (validResult != '') {
        this.messageService.add({ key: 'success', severity: 'error', life: 2000, detail: validResult });
      }
      else {
        if (!this.dtDate) {
          this.messageService.add({ key: 'success', severity: 'error', life: 2000, detail: 'שדה תאריך חובה' });

        }
        else {
          let yechida = this.KodYechidaMevazaat == 0 ? "-1" : this.KodYechidaMevazaat.toString();
          let sug_mesima = this.dochForm.controls.sugMesima.value.value;
          let reportParameters: string = `date=${moment(this.dtDate).format("DD/MM/YYYY")}&sug_mesima=${sug_mesima}&YechidaID=${yechida}`;
          this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.globalUrl + reportParameters);
        }
      }
    }
  }
}
