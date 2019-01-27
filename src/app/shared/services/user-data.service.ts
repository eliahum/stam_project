import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { UserService } from 'src/app/sidur_avoda/shared/services/user.service';
import { SpaUserService } from 'src/spa/services/user.service';

@Injectable()
export class UserDataService {
  KodSidurAvoda:number=0;
  KodYechidaMevatzat:number=71;
  IdYechidaMevatzat:number=53;
  Today:Date;
  TaarichSidur:Date=moment("2018-07-25").toDate();//new Date(2018, 7, 3);
  constructor(private userService: UserService,private spaUserService:SpaUserService) { }  
  load(): Promise<any> {
    
    //this.userData.TaarichSidur=moment("2018-07-02").toDate();
    return new Promise((resolve, reject) => {

      this.userService.GetUserData().subscribe(prms => {
          this.KodYechidaMevatzat = prms.YechidaKod;
          this.TaarichSidur = moment(prms.ToDay).toDate();
          this.Today= moment(prms.ToDay).toDate();
          this.spaUserService.setUserData(prms.UserData);
          resolve();
        });

      });
    }
}
