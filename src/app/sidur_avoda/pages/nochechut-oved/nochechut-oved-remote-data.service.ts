import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators/map';
import { tap } from 'rxjs/operators/tap';


import { UserDataService } from 'src/app/shared/services/user-data.service';

import { toODataString } from '@progress/kendo-data-query';
import { RemoteDataService } from '../../shared/services/data.service';
import { Observable } from 'rxjs/Observable';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { NochechutOvedService } from '../..';


@Injectable()
export  class NochechutOvedRemoteDataService extends RemoteDataService {
  currentUser: number;
  constructor(http: HttpClient, private srv: NochechutOvedService, userData: UserDataService) { super(userData, http); }

  fetch(state: any): Observable<GridDataResult> {
    const queryStr = `${toODataString(state)}`;
    this.skip = state.skip;
    this.pageSize = state.take;
    return this.srv.GetNochechutOved(this.skip,50,this.currentUser,this.userData.IdYechidaMevatzat, this.userData.TaarichSidur).pipe(
      map(response => (<GridDataResult>{
        data: response.Data,
        total: parseInt(response.TotalPage, 10)
      })),
      tap(() => this.loading = false)
    );
    /*return this.srv.GetNochechutOved(this.skip, 50, this.currentUser, this.userData.IdYechidaMevatzat, this.userData.TaarichSidur)
    .then(result => {
      this.lstNochechutOved = result.Data;
      this.totalRecords = result.TotalPage;
      //$("p-paginator").wrap("<div class='ui-rtl' dir='ltr'></div>");
      setTimeout(() => this.loading = false, 0);
    });*/

  }

}    
