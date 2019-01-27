import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IntlService } from '@progress/kendo-angular-intl';
import { SpaConfigService } from 'src/spa';
import { map } from 'rxjs/internal/operators/map';
import { Observable } from 'rxjs/Observable';
import { Filter } from '../..';

@Injectable({
  providedIn: 'root'
})
export class RechevService {

  constructor( private http: HttpClient, private intl: IntlService,
    private configService: SpaConfigService) { }

    public GetRechevDetails(
      mispar_rishui:string
    ): Observable<any> {
      let params = new HttpParams();
      params = params.append('mispar_rishui', mispar_rishui ? mispar_rishui.toString() : null);
      return this.http.get<any[]>(this.configService.config.getRechevDetails,
        {  params: params }).pipe(
           map(data => data)
        );
      
    }
    public GetRechavimPeilim(skip: number, take: number, filters: Filter[],sortOrder?: number, sortField?: string): Observable<any> {
      let params = new HttpParams();
      params = params.append('skip', skip.toString());
      params = params.append('take', take.toString());
      params = params.append('filters', filters ? JSON.stringify(filters) : null);
      params = params.append('sortOrder', sortOrder ? sortOrder.toString() : null);
      params = params.append('sortField', sortField ? sortField.toString() : '');
  
      return this.http.get<any[]>(this.configService.config.getRechavimPeilim,{params:params}).pipe(
           map(data => data)
        );
      
    }
    public GetRechevDetailsByMisparPnimi(
      mispar_pnimi:string
    ): Observable<any> {
      let params = new HttpParams();
      params = params.append('mispar_pnimi', mispar_pnimi ? mispar_pnimi.toString() : null);
      return this.http.get<any[]>(this.configService.config.getRechevDetailsByMisparPnimi,
        {  params: params }).pipe(
           map(data => data)
        );
      
    }
}
