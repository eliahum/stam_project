import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/internal/Observable';
import { tap } from 'rxjs/internal/operators/tap';
import { map } from 'rxjs/internal/operators/map';


import { SpaConfigService } from 'src/spa';
import { Filter } from '../types/filter';
import { IYechidaIrgunit } from '../types/yechida';




@Injectable()
export class YechidaService {


  constructor(private http: HttpClient,private configService:SpaConfigService) { }

  public getYechidot(withPerm:boolean,skip: number, take: number,
    filters?: Filter[],
    sortOrder?: number, sortField?: string): Observable<any> {
  
      let params = new HttpParams();
    params = params.append('skip', skip.toString());
    params = params.append('take', take.toString());
    //params = params.append('kod_yechida',kodYechida? kodYechida.toString():null);     
    //params = params.append('teur',teur? teur.toString():'');     
    params = params.append('filters', filters ? JSON.stringify(filters) : null);
    params = params.append('sortOrder', sortOrder ? sortOrder.toString() : null);
    params = params.append('sortField', sortField ? sortField.toString() : '');
    params = params.append('withPerm',withPerm ?'1':'0');

    
    return this.http.get<IYechidaIrgunit[]>(this.configService.config.yechidaUrl, { params: params }).pipe(
      tap((yechidot: IYechidaIrgunit[]) => console.log(yechidot)),
      map(data => data)
    )

  }
}
