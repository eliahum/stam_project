import { Component, OnInit, Inject, LOCALE_ID, HostBinding } from '@angular/core';
import { State } from '@progress/kendo-data-query';
import { IntlService, DatePipe } from '@progress/kendo-angular-intl';
import { formatDate } from '@angular/common';
import { UserDataService } from 'src/app/shared/services/user-data.service';
import { MaakavRemoteDataService } from './maakav-remote-data.service';
import { IYechidaIrgunit, OvedService } from '../..';
import { IPirteiOved } from '../../shared/types/pirtei_oved';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { BasePageSidurComponent } from '../base-page-sidur/base-page-sidur-component';

@Component({
  selector: 'maakav-niud-ovdim',
  templateUrl: './maakav-niud-ovdim.component.html',
  styleUrls: ['./maakav-niud-ovdim.component.scss']
})
export class MaakavNiudOvdimComponent extends BasePageSidurComponent implements OnInit {

  public KodYechidaMevazaat: number;
  public dtMeDate: Date = this.userData.TaarichSidur;
  public dtAdDate: Date =new Date(moment(this.userData.TaarichSidur).add(7, 'day').format("MM/DD/YYYY"));;
  public lstOvdim:Array<IPirteiOved>=[];
  public ovedText:string;
  public gridState: State = {
    sort: [],
    skip: 0,
    take: 12
  };

  constructor(private intl: IntlService,
    @Inject(LOCALE_ID) private locale: string,
    private remoteSrv: MaakavRemoteDataService,
    private ovedSrv: OvedService,
    private userData: UserDataService,
    protected activatedRoute: ActivatedRoute
    ) { 
      super(activatedRoute);
      this.KodYechidaMevazaat = this.userData.KodYechidaMevatzat;
      this.remoteSrv.yechidaKvuaID=this.userData.IdYechidaMevatzat;
    }

  ngOnInit() {
  super.ngOnInit();
    this.remoteSrv.dtMeDate = this.dtMeDate//this.userData.TaarichSidur;
    this.remoteSrv.dtAdDate = this.dtAdDate//this.userData.TaarichSidur;
  }
  public dtMeChange(value: Date) {
    this.remoteSrv.dtMeDate = value;
    this.remoteSrv.refresh();
  }
  public dtAdChange(value: Date) {
    this.remoteSrv.dtAdDate = value;
    this.remoteSrv.refresh();
  }
  OnHazeg(){
    this.remoteSrv.refresh();
  }
  OvedChange(value){
     let users=this.lstOvdim.slice().filter((s) => s.full_name.toLowerCase().indexOf(value.toLowerCase()) !== -1);     
     if (users.length==1){
      this.remoteSrv.OvedId=Number(users[0].k_user);
      this.remoteSrv.refresh();
     }
     else{
      this.remoteSrv.OvedId=null;
      this.remoteSrv.refresh();
     }
    }
  autoCompFilter(value) {
    this.ovedSrv.GetOvdimByName(value).subscribe((data)=>{
      this.lstOvdim=data;
    });
  }
  OnYechidaKvuaChanged({ yechidaData, action }) {
    let row = yechidaData as IYechidaIrgunit;

    this.remoteSrv.yechidaKvuaID=row.id_yechida;
    
    if (action != 'init') {
      this.remoteSrv.refresh();  
    }

      
    
  }
  OnCloseYechidaKvua(row: IYechidaIrgunit) {

    if (row != 'empty') {
      //this.remoteSrv.yechidaKvuaID=row.id_yechida;
      //this.remoteSrv.refresh();
    }
  }
  OnYechidaZmanitChanged({ yechidaData, action }) {
    let row = yechidaData as IYechidaIrgunit;
    this.remoteSrv.yechidaZmanitID=row.id_yechida;
    this.remoteSrv.refresh();
  }
  OnCloseYechidaZmanit(row: IYechidaIrgunit) {

    if (row != 'empty') {
      //this.remoteSrv.yechidaZmanitID=row.id_yechida;
      //this.remoteSrv.refresh();
    }
  }
  transformDate(date) {
    return formatDate(date, 'dd/MM/yyyy', this.locale);
  }

}
