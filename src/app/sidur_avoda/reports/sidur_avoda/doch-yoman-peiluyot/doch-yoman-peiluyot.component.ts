import { Component, OnInit} from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { UserDataService } from 'src/app/shared/services/user-data.service';
import { MessageService } from 'primeng/api';
import {  FormBuilder } from '@angular/forms';
import { BaseReportComponent } from '../../base-report-component';
import { OvedService, IYechidaIrgunit } from 'src/app/sidur_avoda';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-doch-yoman-peiluyot',
  templateUrl: './doch-yoman-peiluyot.component.html',
  styleUrls: ['./doch-yoman-peiluyot.component.scss']
})


export class DochYomanPeiluyotComponent extends BaseReportComponent implements OnInit {
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
  reportName: string = "tvr_r_yoman_peiloyot";
  globalUrl: string = this.urlBase + this.reportName + "&rs:Command=Render&rc:Parameters=false&";
  url: SafeResourceUrl;
  dtDate: Date;
  KodYechidaMevazaat: number;
  IdYechidaMevatzat: number;
  constructor(public sanitizer: DomSanitizer, public userData: UserDataService,
    private messageService: MessageService,
    private fb: FormBuilder,
    protected activatedRoute:ActivatedRoute,
    private ovedService: OvedService
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
 


  ngOnInit() {
super.ngOnInit();
    this.dochForm = this.fb.group({
      'month': [this.month],
      'year': [this.year]
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

    let reportParameters: string = `month=${this.dochForm.controls.month.value.value}&yechida=${this.IdYechidaMevatzat}` +
      `&year=${this.dochForm.controls.year.value.value}`;
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.globalUrl + reportParameters);

  }
}


