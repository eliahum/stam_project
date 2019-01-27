import { Injectable } from '@angular/core';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators/map';
import { tap } from 'rxjs/operators/tap';
import { Observable } from 'rxjs/Observable';

import { UserDataService } from 'src/app/shared/services/user-data.service';
import { toODataString } from '@progress/kendo-data-query';
import { RemoteDataService } from '../../shared/services/data.service';
import { HefreshPremiaService } from '../..';


@Injectable()
export class HefreshimRemoteDataService extends RemoteDataService {
  yechidaId?: number;
  userID?: number;
  Year?: number;
  MeHodesh?: number;
  AdHodesh?: number;
  Pail?: number;
  constructor(http: HttpClient, private srv: HefreshPremiaService, userData: UserDataService) { super(userData, http); }
  fetch(state: any): Observable<GridDataResult> {
    const queryStr = `${toODataString(state)}`;
    this.skip = state.skip;
    this.pageSize = state.take;
    return this.srv.GetHefresheiPremiot(this.skip, this.pageSize,this.yechidaId,this.userID,this.Year,
      this.MeHodesh,this.AdHodesh,this.Pail).pipe(
      map(response => (<GridDataResult>{
        data: response.Data,
        total: parseInt(response.TotalPage, 10)
      })),
      tap(() => this.loading = false)
    );

  }

}    
