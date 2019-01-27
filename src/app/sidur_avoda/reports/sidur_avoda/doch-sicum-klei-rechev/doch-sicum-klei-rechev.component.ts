import { Component, OnInit } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

import { UserDataService } from 'src/app/shared/services/user-data.service';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { BaseReportComponent } from '../../base-report-component';

@Component({
  selector: 'app-doch-sicum-klei-rechev',
  templateUrl: './doch-sicum-klei-rechev.component.html',
  styleUrls: ['./doch-sicum-klei-rechev.component.scss']
})
export class DochSicumKleiRechevComponent extends BaseReportComponent implements OnInit{
  reportName: string = "tvr_r_sikom_kli_rechv";
  globalUrl: string = this.urlBase + this.reportName + "&rs:Command=Render&rc:Parameters=false&";
  url: SafeResourceUrl;

  constructor(public sanitizer: DomSanitizer, public userData: UserDataService,
    protected activatedRoute: ActivatedRoute,
    ) {   
    super(activatedRoute);
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl("");
  }

  ngOnInit() {
    super.ngOnInit();
  }
  Hazeg(){
    let reportParameters: string = `today=${moment(this.userData.Today).format("DD/MM/YYYY")}`;
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.globalUrl + reportParameters);
  }

}
