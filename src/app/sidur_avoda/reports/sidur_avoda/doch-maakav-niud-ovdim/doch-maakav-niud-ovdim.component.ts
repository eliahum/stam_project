import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { UserDataService } from 'src/app/shared/services/user-data.service';
import { IYechidaIrgunit } from '../../..';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { Validators, FormBuilder } from '@angular/forms';
import { BaseReportComponent } from '../../base-report-component';


@Component({
  selector: 'app-doch-maakav-niud-ovdim',
  templateUrl: './doch-maakav-niud-ovdim.component.html',
  styleUrls: ['./doch-maakav-niud-ovdim.component.scss']

})
export class DochMaakavNiudOvdimComponent extends BaseReportComponent implements OnInit {
  reportName: string = "tvr_r_niyod_ovdim";
  globalUrl: string = this.urlBase + this.reportName + "&rs:Command=Render&rc:Parameters=false&";
  url: SafeResourceUrl;

  dtFrom: Date;
  dtTo: Date;
  KodYechidaMevazaat: number;
  IdYechidaMevatzat: number;
  constructor(public sanitizer: DomSanitizer, public userData: UserDataService,
    private messageService: MessageService,
    private fb: FormBuilder,protected activatedRoute: ActivatedRoute
  ) {
    super(activatedRoute);
    this.dtFrom = this.userData.Today;
    this.dtTo = this.userData.Today;
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl("");
    this.KodYechidaMevazaat = this.userData.KodYechidaMevatzat;
    this.IdYechidaMevatzat = this.userData.IdYechidaMevatzat;


  }

  ngOnInit() {
    super.ngOnInit();
    this.dochForm = this.fb.group({
      'dtFrom': [this.dtFrom, Validators.required],
      'dtTo': [this.dtTo, Validators.required]
    });
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
let hodaa:string="תאריך סיום חייב להיות גדול מתאריך התחלה ";
    if (this.dochForm.valid) {
      if(super.checkDiffDates(this.dochForm.controls.dtFrom.value,this.dochForm.controls.dtTo.value)){
        this.messageService.add({ key: 'success', severity: 'error', life: 2000, detail: hodaa });
        return;
      }
      let validResultFrom = super.validate(this.dochForm.controls.dtFrom.value);
      let validResultTo = super.validate(this.dochForm.controls.dtTo.value);
      if (validResultFrom != '') {
        this.messageService.add({ key: 'success', severity: 'error', life: 2000, detail: validResultFrom });
      }
      else if (validResultTo != '') {
        this.messageService.add({ key: 'success', severity: 'error', life: 2000, detail: validResultTo });
      }
      if (validResultFrom == '' && validResultTo == '') {
        let yechidaStr=this.IdYechidaMevatzat == 0?``: `&YechidaKvuaID=${this.IdYechidaMevatzat}`;
        let reportParameters: string = `MeTaarich=${moment(this.dochForm.controls.dtFrom.value).format("DD/MM/YYYY")}&AdTaarich=${moment(this.dochForm.controls.dtTo.value).format("DD/MM/YYYY")}${yechidaStr}`;
        this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.globalUrl + reportParameters);
      }
    }
  }

}
