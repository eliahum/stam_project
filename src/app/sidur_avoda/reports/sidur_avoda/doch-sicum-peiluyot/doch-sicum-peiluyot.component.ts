import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { UserDataService } from 'src/app/shared/services/user-data.service';
import { IYechidaIrgunit } from '../../..';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { ActivatedRoute } from '@angular/router';
import { BaseReportComponent } from '../../base-report-component';

@Component({
  selector: 'app-doch-sicum-peiluyot',
  templateUrl: './doch-sicum-peiluyot.component.html',
  styleUrls: ['./doch-sicum-peiluyot.component.scss']
})
export class DochSicumPeiluyotComponent  extends BaseReportComponent implements OnInit {
  reportName: string = "tvr_r_sicom_peulot";
  globalUrl: string = this.urlBase + this.reportName + "&rs:Command=Render&rc:Parameters=false&";//+this.reportParameters;
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

  ngOnInit() {
  super.ngOnInit();
    this.dochForm = this.fb.group({
      'dtDate': [this.dtDate, Validators.required]
    });
  }

  OnPrevDateClick() {

  }
  OnNextDateClick() {

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
          let reportParameters: string = `date=${moment(this.dtDate).format("DD/MM/YYYY")}&YechidaID=${yechida}`;
          this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.globalUrl + reportParameters);
        }
      }
    }
  }

}
