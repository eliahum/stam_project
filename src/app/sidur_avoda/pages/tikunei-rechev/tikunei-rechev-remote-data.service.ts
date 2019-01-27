import { Injectable } from '@angular/core';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators/map';
import { tap } from 'rxjs/operators/tap';
import { Observable } from 'rxjs/Observable';

import { UserDataService } from 'src/app/shared/services/user-data.service';
import { toODataString } from '@progress/kendo-data-query';
import { RemoteDataService } from '../../shared/services/data.service';
import { TikuneiRechevService } from '../..';


@Injectable()
export class TikuneiRechevRemoteDataService extends RemoteDataService {
  
  private data: any[] = [];
  rechevId?:string;
  meTaarich?: Date;
  nahagId?: number;
  goremMedaveahId?: number;
  isFixed?:number;
  constructor(http: HttpClient, private srv: TikuneiRechevService, userData: UserDataService)
   { super(userData, http); }
   
  fetch(state: any): Observable<GridDataResult> {
    
    const queryStr = `${toODataString(state)}`;
    this.skip = state.skip;
    this.pageSize = state.take;
    return this.srv.GetTikuniRechev(this.skip, this.pageSize,
       this.rechevId, this.meTaarich,this.nahagId,this.goremMedaveahId,this.isFixed).pipe(
      map(response => (<GridDataResult>{
        data: response.Data,
        total: parseInt(response.TotalPage, 10)
      })),
      tap(() => this.loading = false)
    );

  }

}    
