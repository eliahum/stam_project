import { Component, OnInit } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { UserDataService } from 'src/app/shared/services/user-data.service';
import { IYechidaIrgunit, OvedService } from '../../..';
import { MessageService } from 'primeng/api';
import { Validators, FormBuilder } from '@angular/forms';

import { ActivatedRoute } from '@angular/router';
import { BaseReportComponent } from './../../base-report-component';
import { IPirteiOved } from 'src/app/sidur_avoda/shared/types/pirtei_oved';

@Component({
  selector: 'app-doch-chodshi-le-oved',
  templateUrl: './doch-chodshi-le-oved.component.html',
  styleUrls: ['./doch-chodshi-le-oved.component.scss']

})

export class DochChodshiLeOvedComponent extends BaseReportComponent implements OnInit {
  public months: Array<{ text: string, value: number }> = [
    { text: "ינואר", value: 1 },
    { text: "פברואר", value: 2 },
    { text: "מרץ", value: 3 },
    { text: "אפריל", value: 4 },
    { text: "מאי", value: 5 },
    { text: "יוני", value: 6 },
    { text: "יולי", value: 7 },
    { text: "אוגוסט", value: 8 },
    { text: "ספטמבר", value: 9 },
    { text: "אוקטובר", value: 10 },
    { text: "נובמבר", value: 11 },
    { text: "דצמבר", value: 12 }
  ];
  public years: Array<{ text: string, value: number }> = [];
  public year: { text: string, value: number } = { text: this.userData.Today.getFullYear().toString(), value: this.userData.Today.getFullYear() };
  public month: { text: string, value: number } = { text: "ינואר", value: 1 };
  public ovdim: Array<IPirteiOved> = [];
  public oved: IPirteiOved = { full_name: "", k_user: -1 };
  reportName: string = "tvr_r_monthly_oved";
  globalUrl: string = this.urlBase + this.reportName + "&rs:Command=Render&rc:Parameters=false&";
  url: SafeResourceUrl;
  dtDate: Date;
  chkOvedNehag: boolean = false;
  KodYechidaMevazaat: number;
  IdYechidaMevatzat: number;
  constructor(public sanitizer: DomSanitizer, public userData: UserDataService,
    private messageService: MessageService,
    private fb: FormBuilder,
    private ovedService: OvedService,protected activatedRoute: ActivatedRoute
  ) {
    super(activatedRoute);
    this.dtDate = this.userData.Today;
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl("");
    this.KodYechidaMevazaat = this.userData.KodYechidaMevatzat;
    this.IdYechidaMevatzat = this.userData.IdYechidaMevatzat;

    for (let i = this.userData.Today.getFullYear() - 10; i <= this.userData.Today.getFullYear(); i++) {
      this.years.push({ text: i.toString(), value: i });
    }



  }
  SetPoalimNehagimByYechida(kod_yechida: number, kolelLoPeilim: false) {
    this.ovedService.GetPoalimNehagimByYechida(this.KodYechidaMevazaat, false).subscribe((result) => {

      this.ovdim = result;

      this.dochForm.controls.oved.setValue(this.ovdim[0]);
    });
  }

  OnCheckOvedNehag(event:any){
    this.SetPoalimNehagimByYechida(this.KodYechidaMevazaat,this.dochForm.controls.chkOvedNehag.value);
  }
  ngOnInit() {
super.ngOnInit();
    this.dochForm = this.fb.group({
      'dtDate': [this.dtDate, Validators.required],
      'month': [this.month],
      'year': [this.year],
      'chkOvedNehag': [this.chkOvedNehag],
      'oved': [this.oved]
    });
  }
  OnYechidaMevazaatChanged({ yechidaData, action, parentrow }) {
    if (action != 'init') {
      this.KodYechidaMevazaat = Number(yechidaData.kod_yechida);
      this.IdYechidaMevatzat = Number(yechidaData.id_yechida);
    }
    this.SetPoalimNehagimByYechida(this.KodYechidaMevazaat,false);

  }
  OnCloseYechidaMevazaat(row: IYechidaIrgunit) {

    if (row != 'empty') {
      //this.userData.KodYechidaMevatzat = Number(row.kod_yechida);
      //this.userData.IdYechidaMevatzat = row.id_yechida;
    }

  }
  OnHazeg(){

    let reportParameters: string = `month=${this.dochForm.controls.month.value.value}&yechida=${this.IdYechidaMevatzat}`+
    `&k_user=${this.dochForm.controls.oved.value.k_user}&year=${this.dochForm.controls.year.value.value}` +
    `&sw_payil_lo_payil=0`;
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.globalUrl + reportParameters);

  }
}


