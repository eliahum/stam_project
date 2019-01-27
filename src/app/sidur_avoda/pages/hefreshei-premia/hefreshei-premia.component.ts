import { Component, OnInit } from '@angular/core';
import { BasePageSidurComponent } from '../base-page-sidur/base-page-sidur-component';
import { ActivatedRoute, Router } from '@angular/router';
import { IYechidaIrgunit } from '../..';
import { UserDataService } from 'src/app/shared/services/user-data.service';
import { State } from '@progress/kendo-data-query';
import { HefreshimRemoteDataService } from './hefreshim-remote-data.service';

@Component({
  selector: 'app-hefreshei-premia',
  templateUrl: './hefreshei-premia.component.html',
  styleUrls: ['./hefreshei-premia.component.scss']
})
export class HefresheiPremiaComponent extends BasePageSidurComponent implements OnInit {
  KodYechidaMevazaat: number = this.userData.KodYechidaMevatzat;
  public gridState: State = {
    sort: [],
    skip: 0,
    take: 12
  };
  constructor(
    private router:Router,private hefreshRemote:HefreshimRemoteDataService,
    protected activatedRoute:ActivatedRoute,private userData:UserDataService) {
      
      super(activatedRoute);
      hefreshRemote.MeHodesh=1;
      hefreshRemote.AdHodesh=12;
      hefreshRemote.Pail=1;
   }

  ngOnInit() {
    super.ngOnInit();
  }

  OnYechidaMevazaatChanged({ yechidaData, action }) {
    let row = yechidaData as IYechidaIrgunit;
    if (action != 'init') {
//      this.headrutRemoteDataService.refresh();//.query({ skip: 0, take: 12 });
    }
  }

  OnCloseYechidaMevazaat(row: IYechidaIrgunit) {

    if (row != 'empty') {
    }

  }
  OnHazeg(){

  }
  OpenHefreshPremia(dataItem: any) {
    
    //this.router.navigate(["/hefreshei_premia_action", 6],{k_user:123});
    this.router.navigate(['/hefreshei_premia_action',6], { queryParams: { k_user: dataItem.k_user } });
    //this.RefreshNochechutOved(0);
  }


}
