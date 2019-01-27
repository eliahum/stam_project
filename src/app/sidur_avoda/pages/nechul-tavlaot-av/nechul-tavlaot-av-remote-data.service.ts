import { Injectable } from '@angular/core';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators/map';
import { tap } from 'rxjs/operators/tap';
import { Observable } from 'rxjs/Observable';

import { UserDataService } from 'src/app/shared/services/user-data.service';
import { toODataString, State } from '@progress/kendo-data-query';
import { RemoteDataService } from '../../shared/services/data.service';
import {NechulTavlaotAvService} from '../../shared/services/nechul-tavlaot-av.service';


@Injectable()
export class TavlaotAvRemoteDataService extends RemoteDataService {
  zmanHatchala:Date;
  zmanSof:Date;
  swPail:number;
  tableId:number;
  field: string;
  dir:string;
  constructor(http: HttpClient, private srv: NechulTavlaotAvService, userData: UserDataService) { super(userData, http); }  
  fetch(state: any): Observable<GridDataResult> {
    let queryStr = `${toODataString(state)}`;
    queryStr = queryStr.split('$').join('');
   
    return this.srv.GetNechulTavlaotAv(queryStr,
      this.zmanHatchala, this.zmanSof,this.swPail,this.tableId).pipe(
      tap((data) => {this.loading = false}),
      map(response => (<GridDataResult>{
        data: response.Data,
        total: parseInt(response.TotalPage, 10)
      }))
      
    );

  }

}    
