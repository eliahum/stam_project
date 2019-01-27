import { Component, OnInit } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { UserDataService } from 'src/app/shared/services/user-data.service';
import { FormBuilder, Validators } from '@angular/forms';
import { BaseReportComponent } from '../../base-report-component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-doch-harigey-hafuch-dachas-shkayey-karka',
  templateUrl: './doch-harigey-hafuch-dachas-shkayey-karka.component.html',
  styleUrls: ['./doch-harigey-hafuch-dachas-shkayey-karka.component.scss']
})
export class DochHarigeyHafuchDachasShkayeyKarkaComponent extends BaseReportComponent implements OnInit {
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
  public sugeyMesima: Array<{ text: string, value: number }> = [
    { text: "הפוך לדחס", value: 0 },
    { text: "שקועי קרקע", value: 1 }
  ];
  public kenLoSelect: Array<{ text: string, value: number }> = [
    { text: "לא", value: 0 },
    { text: "כן", value: 1 }
  ];
  public year: { text: string, value: number } = { text: this.userData.Today.getFullYear().toString(), value: this.userData.Today.getFullYear() };
  public month: { text: string, value: number } = { text: "ינואר", value: 1 };
  public sugMesima: { text: string, value: number } = { text: "הפוך לדחס", value: 0 };
  public male: { text: string, value: number } = { text: "לא", value: 0 };
  public pinuim: number = 31;
  public hafuhLeDahas = 0;
  public mishkal = 6500;
  
  reportName: string = "tvr_r_doch_charigim_hipuch_dachas";
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
      'year': [this.year, Validators.required],
      'sugMesima':[this.sugMesima, Validators.required],
      'male':[this.male, Validators.required],
      'pinuim': [this.pinuim, Validators.required],
      'mishkal': [this.mishkal, Validators.required]
    });
  }
    OnHazeg() {
      if(this.dochForm.valid){
      var pinuim = +this.dochForm.controls.pinuim.value - 1;
      let reportParameters: string = `Month=${this.dochForm.controls.month.value.value}`+
      `&Year=${this.dochForm.controls.year.value.value}` +
      `&IsMale=${this.dochForm.controls.male.value.value}` +
      `&KamutPinuiim=${pinuim}` +
      `&Mishkal=${this.dochForm.controls.mishkal.value}` +
      `&IsDachas=${this.dochForm.controls.sugMesima.value.value}`;
      this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.globalUrl + reportParameters);
      }
    }
    hafuhLeDahasChange(evt) {
      var target = evt.target;
      var targetValue = target.value; 
      switch(targetValue){
        case "0":
          this.dochForm.controls["male"].setValue( { text: "לא", value: 0 });
          this.dochForm.controls["pinuim"].setValue(31);
          this.dochForm.controls["sugMesima"].setValue({ text: "הפוך לדחס", value: 0 }) ;
        break;
        case "1":
          this.dochForm.controls["male"].setValue( { text: "כן", value: 1 });
          this.dochForm.controls["pinuim"].setValue(27);
          this.sugMesima = { text: "הפוך לדחס", value: 0 };
        break;
        case "2":
          this.dochForm.controls["male"].setValue( { text: "כן", value: 1 });
          this.dochForm.controls["pinuim"].setValue(38);
          this.sugMesima =  { text: "שקועי קרקע", value: 1 };
        break;
      }
    }
}

