import { Component, OnInit } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { UserDataService } from 'src/app/shared/services/user-data.service';
import { FormBuilder, Validators } from '@angular/forms';
import { BaseReportComponent } from '../../base-report-component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-doch-yemim-lo-nisgeru',
  templateUrl: './doch-yemim-lo-nisgeru.component.html',
  styleUrls: ['./doch-yemim-lo-nisgeru.component.scss']
})
export class DochYemimLoNisgeruComponent extends BaseReportComponent implements OnInit {
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
 
  reportName: string = "tvr_r_yamim_lo_sgurim";
  globalUrl: string = this.urlBase + this.reportName + "&rs:Command=Render&rc:Parameters=false&";
  url: SafeResourceUrl;
  dtDate: Date;
  constructor(public sanitizer: DomSanitizer, public userData: UserDataService,
    private fb: FormBuilder,protected activatedRoute:ActivatedRoute
  ) {
    super(activatedRoute);
    this.dtDate = this.userData.Today;
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl("");

    for (let i = this.userData.Today.getFullYear() - 10; i <= this.userData.Today.getFullYear(); i++) {
      this.years.push({ text: i.toString(), value: i });
    }
  }
 
  ngOnInit() {  
    super.ngOnInit();
    this.dochForm = this.fb.group({
      'month': [this.month, Validators.required],
      'year': [this.year, Validators.required]
    });
  }
  OnHazeg() {
    if(this.dochForm.valid){
      let reportParameters: string = `month=${this.dochForm.controls.month.value.value}&year=${this.dochForm.controls.year.value.value}`;
      this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.globalUrl + reportParameters);
    }
  }
}