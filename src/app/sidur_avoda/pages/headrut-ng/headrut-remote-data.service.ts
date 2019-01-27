import { Injectable } from '@angular/core';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators/map';
import { tap } from 'rxjs/operators/tap';
import { Observable } from 'rxjs/Observable';

import { UserDataService } from 'src/app/shared/services/user-data.service';
import { toODataString } from '@progress/kendo-data-query';
import { RemoteDataService } from '../../shared/services/data.service';
import { NochechutOvedService } from '../..';


@Injectable()
export class HeadrutRemoteDataService extends RemoteDataService {
  constructor(http: HttpClient, private srv: NochechutOvedService, userData: UserDataService) { super(userData, http); }
   fetch(state: any): Observable<GridDataResult> {
    const queryStr = `${toODataString(state)}`;
    this.skip = state.skip;
    this.pageSize = state.take;
    return this.srv.GetNochechutOvim(this.skip, this.pageSize, this.userData.TaarichSidur, this.userData.IdYechidaMevatzat).pipe(
      map(response => (<GridDataResult>{
        data: response.Data,
        total: parseInt(response.TotalPage, 10)
      })),
      tap(() => this.loading = false)
    );

  }

}    
