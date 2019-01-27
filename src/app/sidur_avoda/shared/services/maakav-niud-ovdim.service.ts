import { Injectable } from '@angular/core';

import { HttpParams, HttpClient } from '@angular/common/http';
import { SpaConfigService } from 'src/spa';
import { IntlService } from '@progress/kendo-angular-intl';
import { MaakavNiudOved } from '../..';
import { map } from 'rxjs/internal/operators/map';
import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/internal/operators/tap';


@Injectable({
  providedIn: 'root'
})
export class MaakavNiudOvdimService {

  constructor( private http: HttpClient, private intl: IntlService,
    private configService: SpaConfigService) { }

  public GetMaakavNiudOvdim(
    skip: number, take: number,meTaarich: Date,adTaarich:Date,
    yechidaKvuaID?: number,yechidaZmanitID?: number,ovedId?: number,measherShabat?: number
  ): Observable<any> {
    let params = new HttpParams();
    params = params.append('skip', skip.toString());
    params = params.append('take', take.toString());
    params = params.append('meTaarich', this.intl.formatDate(meTaarich, 'yyyy-MM-dd'));
    params = params.append('adTaarich', this.intl.formatDate(adTaarich, 'yyyy-MM-dd'));
    params = params.append('yechidaKvuaID', yechidaKvuaID ? yechidaKvuaID.toString() : null);
    params = params.append('yechidaZmanitID', yechidaZmanitID ? yechidaZmanitID.toString() : null);
    params = params.append('ovedId', ovedId ? ovedId.toString() : null);
    params = params.append('measherShabat', measherShabat ? measherShabat.toString() : null);

    return this.http.get<MaakavNiudOved[]>(this.configService.config.getMaakavNiudOvdim,
      {  params: params }).pipe(
     tap((pirteioved: MaakavNiudOved[]) => console.log(pirteioved)),
     map(data => data)
   );
    
  }
  
}
