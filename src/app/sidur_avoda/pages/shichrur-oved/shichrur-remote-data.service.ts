import { Injectable } from '@angular/core';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators/map';
import { tap } from 'rxjs/operators/tap';
import { Observable } from 'rxjs/Observable';

import { UserDataService } from 'src/app/shared/services/user-data.service';
import { toODataString } from '@progress/kendo-data-query';
import { RemoteDataService } from '../../shared/services/data.service';
import { ShichrurOvdimService } from '../../shared/services/shichrur-ovdim.service';


@Injectable()
export class ShichrurRemoteDataService extends RemoteDataService {
  dtMeDate:Date;
  dtAdDate:Date;
  private data: any[] = [];
  yechidaKvuaID?:number;
  OvedId?:number;
  constructor(http: HttpClient, private srv: ShichrurOvdimService, userData: UserDataService) { super(userData, http); }
   
  fetch(state: any): Observable<GridDataResult> {
    const queryStr = `${toODataString(state)}`;
    this.skip = state.skip;
    this.pageSize = state.take;
    return this.srv.GetShichrurOvdim(this.skip, this.pageSize,
       this.dtMeDate, this.dtAdDate,this.yechidaKvuaID,this.OvedId).pipe(
      map(response => (<GridDataResult>{
        data: response.Data,
        total: parseInt(response.TotalPage, 10)
      })),
      tap(() => this.loading = false)
    );

  }

}    
