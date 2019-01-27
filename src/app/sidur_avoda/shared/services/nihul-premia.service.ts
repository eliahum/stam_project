import { Injectable } from '@angular/core';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
//import { Observable } from 'rxjs/internal/Observable';
import { IntlService } from '@progress/kendo-angular-intl';
import { SpaConfigService } from 'src/spa';

@Injectable()
export class NihulPremiaService {

  constructor(private http: HttpClient,
    private intl: IntlService,
    private configService: SpaConfigService) { }
  public GetSgiratChodesh(year: number, month: number): Observable<any> {

    let params = new HttpParams();
    params = params.append('Content-Type', 'application/json');
    params = params.append('year', year.toString());
    params = params.append('month', month.toString());

    return this.http.get(this.configService.config.sgiratChodesh, { params: params }).map((response: Response) => {
      return response;
    });
  }
  public CheckAndUpdateSgiratYom(dtSidur: Date, Ymim: number, idYechidaMevazaat: number,
    idYechidaMekabelet: number): Observable<any> {
    let params = new HttpParams();
    //params = params.append('Ymim', Ymim.toString());
    params = params.append('Content-Type', 'application/json');

    params = params.append('dtSidur', this.intl.formatDate(dtSidur, 'yyyy-MM-dd'));
    params = params.append('Ymim', Ymim.toString());
    params = params.append('idYechidaMevazaat', idYechidaMevazaat.toString());
    params = params.append('idYechidaMekabelet', idYechidaMekabelet ? idYechidaMekabelet.toString() : null);
    return this.http.get(this.configService.config.checkAndUpdateSgiratYom, { params: params }).map((response: Response) => {
      return response;
    });

  }



}
