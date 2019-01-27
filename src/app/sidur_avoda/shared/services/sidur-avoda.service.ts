import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest, HttpEventType, HttpHeaders } from '@angular/common/http';
import { Response, URLSearchParams, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

import { IntlService } from '@progress/kendo-angular-intl';

import { ITemplate, IStatusMesima, ISibatHeadrut, ISugMesimaForUpdateKamut, IMesimaMishtana, Filter, IRechevPanui, IOvedPanui, IPeilutNidreshet, ISidurAvoda } from '../../index';

import { Observable } from 'rxjs/internal/Observable';
import { tap } from 'rxjs/internal/operators/tap';
import { map } from 'rxjs/internal/operators/map';

import { SpaConfigService } from 'src/spa';
import { UserDataService } from 'src/app/shared/services/user-data.service';



@Injectable()
export class SidurAvodaService {
  private host = "localhost";

  constructor(private http: HttpClient,
    private userData: UserDataService,
    private intl: IntlService,
    private configService: SpaConfigService
  ) { }

  public gettemplates(skip: number, take: number): Observable<any> {
    let params = new HttpParams();
    params = params.append('skip', skip.toString());
    params = params.append('take', take.toString());

    return this.http.get<ITemplate[]>(this.configService.config.templatesUrl, { params: params }).pipe(
      tap((mecholot: ITemplate[]) => console.log(mecholot)),
      map(data => data)
    )

  }
  private options = new RequestOptions({ withCredentials: true });
  public GetStatusesMesima(): Observable<any> {



    return this.http.get<IStatusMesima[]>(this.configService.config.statusesMesima).pipe(
      tap((statusmesima: IStatusMesima[]) => console.log(statusmesima)),
      map(data => data)
    )
  }
  public GetSibotHeadruyot(): Observable<any> {
    return this.http.get<ISibatHeadrut[]>(this.configService.config.sibotHeadrut).pipe(
      tap((sibot: ISibatHeadrut[]) => console.log(sibot)),
      map(data => data)
    )
  }

  public GetSugeiMesimaForUpdateKamut(): Observable<any> {

    return this.http.get<ISugMesimaForUpdateKamut[]>(this.configService.config.sugeiMesimaForUpdateKamut).pipe(
      tap((sibot: ISugMesimaForUpdateKamut[]) => console.log(sibot)),
      map(data => data)
    )
  }
  public getMesimotMishtanot(
    dtSidur: Date,
    yechidaMevatzatId: number,
    skip: number,
    take: number,
    yechidaMekabeletId?: number
  ): Observable<any> {
    let params = new HttpParams();
    params = params.append('dtSidur', this.intl.formatDate(dtSidur, 'yyyy-MM-dd'));
    params = params.append('yechidaMevatzatId', yechidaMevatzatId ? yechidaMevatzatId.toString() : null);
    params = params.append('skip', skip.toString());
    params = params.append('take', take.toString());
    params = params.append('yechidaMekabeletId', yechidaMekabeletId ? yechidaMekabeletId.toString() : null);

    return this.http.get<IMesimaMishtana[]>(this.configService.config.mesimotMishtanot, { reportProgress: true, params: params }).pipe(
      tap((misimamishtana: IMesimaMishtana[]) => console.log(misimamishtana)),
      map(data => data)
    );
  }
  public InsertUpdateHearatSidur(dtSidur?: Date, id_yechida?: number, hearat_sidur?: string): Observable<any> {
    let params = new HttpParams();
    params = params.append('dtSidur', this.intl.formatDate(dtSidur, 'yyyy-MM-dd'));
    params = params.append('id_yechida', id_yechida ? id_yechida.toString() : null);
    params = params.append('hearat_sidur', hearat_sidur ? hearat_sidur.toString() : null);

    return this.http.post<ITemplate[]>(
      this.configService.config.insertUpdateHearatSidur + "?dtSidur=" +
      this.intl.formatDate(dtSidur, 'yyyy-MM-dd') + "&id_yechida=" + id_yechida.toString() +
      "&hearat_sidur=" + hearat_sidur,
      params).pipe(
        map(data => data)
      );
  }
  public GetSidurAvoda(id_yechida?: number, dtSidur?: Date, id_sidur_avoda?: number): Observable<any> {
    let params = new HttpParams();
    params = params.append('id_yechida', id_yechida ? id_yechida.toString() : null);
    params = params.append('dtSidur', this.intl.formatDate(dtSidur, 'yyyy-MM-dd'));
    params = params.append('id_sidur_avoda', id_sidur_avoda ? id_sidur_avoda.toString() : null);

    return this.http.get<ISidurAvoda>(this.configService.config.getSidurAvoda, { reportProgress: true, params: params }).pipe(
      map(data => data)
    );

  }
  public getRechavimPnuim(
    dtSidur: Date,
    sugRechev: number,
    misparPnimi: string, ymim: number,
    skip: number, take: number, filters: Filter[],
    nefahHetken?: number,
    yecholet_mahavr?: number,
    sortOrder?: number, sortField?: string
  ): Observable<any> {
    let params = new HttpParams();
    params = params.append('startDate', this.intl.formatDate(dtSidur, 'yyyy-MM-dd'));
    params = params.append('sugRechev', sugRechev ? sugRechev.toString() : null);
  //  params = params.append('misparPnimi', misparPnimi == 'null' ? null : misparPnimi.toString());
  //params = params.append('misparPnimi','204');
//alert(misparPnimi);
    params = params.append('misparPnimi', misparPnimi ?misparPnimi.toString(): '' );
    params = params.append('nefahHetken', nefahHetken ? nefahHetken.toString() : null);
    params = params.append('yecholet_mahavr', (yecholet_mahavr && yecholet_mahavr != -1) ? yecholet_mahavr.toString() : null);
    params = params.append('ymim', ymim ? ymim.toString() : null);
    params = params.append('skip', skip.toString());
    params = params.append('take', take.toString());
    params = params.append('filters', filters ? JSON.stringify(filters) : null);
    params = params.append('sortOrder', sortOrder ? sortOrder.toString() : null);
    params = params.append('sortField', sortField);



    return this.http.get<IRechevPanui[]>(this.configService.config.rechavimPnuim, { reportProgress: true, params: params }).pipe(
      tap((rechevpanui: IRechevPanui[]) => console.log(rechevpanui)),
      map(data => data)
    );

  }
  public getRechevPanui(
    dtSidur: Date,
    sugRechev: number,
    misparPnimiNotInclude:string,misparPnimi: string,
     ymim: number,
    skip: number, take: number, filters: Filter[],
    nefahHetken?: number,
    yecholet_mahavr?: number,
    sortOrder?: number, sortField?: string
  ): Observable<any> {
    let params = new HttpParams();
    params = params.append('startDate', this.intl.formatDate(dtSidur, 'yyyy-MM-dd'));
    params = params.append('sugRechev', sugRechev ? sugRechev.toString() : null);
    params = params.append('misparPnimiNotInclude', misparPnimiNotInclude == '' ? null : misparPnimiNotInclude.toString());
    params = params.append('misparPnimi', misparPnimi == '' ? null : misparPnimi.toString());
    params = params.append('nefahHetken', nefahHetken ? nefahHetken.toString() : null);
    params = params.append('yecholet_mahavr', (yecholet_mahavr && yecholet_mahavr != -1) ? yecholet_mahavr.toString() : null);
    params = params.append('ymim', ymim ? ymim.toString() : null);
    params = params.append('skip', skip.toString());
    params = params.append('take', take.toString());
    params = params.append('filters', filters ? JSON.stringify(filters) : null);
    params = params.append('sortOrder', sortOrder ? sortOrder.toString() : null);
    params = params.append('sortField', sortField);



    return this.http.get<IRechevPanui[]>(this.configService.config.getRechevPanui, { reportProgress: true, params: params }).pipe(
      tap((rechevpanui: IRechevPanui[]) => console.log(rechevpanui)),
      map(data => data)
    );

  }
  public getOvdimPnuim(
    dtSidur: Date,
    userId: number,
    yechidaId: number,
    sugPeilutId: number,
    ymim: number,
    sugRechev: number,
    skip: number, take: number, filters: Filter[],
    sortOrder?: number, sortField?: string,full_name?:string): Observable<any> {
    let params = new HttpParams();
    params = params.append('dtSidur', this.intl.formatDate(dtSidur, 'yyyy-MM-dd'));
    params = params.append('userId', userId ? userId.toString() : null);
    params = params.append('yechidaId', yechidaId ? yechidaId.toString() : null);
    params = params.append('sugPeilutId', sugPeilutId ? sugPeilutId.toString() : null);
    params = params.append('ymim', ymim ? ymim.toString() : null);
    params = params.append('sugRechev', sugRechev ? sugRechev.toString() : null);
    params = params.append('skip', skip.toString());
    params = params.append('take', take.toString());
    params = params.append('filters', filters ? JSON.stringify(filters) : null);
    params = params.append('sortOrder', sortOrder ? sortOrder.toString() : null);
    params = params.append('sortField', sortField);
    params = params.append('full_name',full_name ? full_name:"");

    const request = new HttpRequest(
      "POST", this.configService.config.ovdimPnuim, { params: params },
      { reportProgress: true });



    return this.http.get<IOvedPanui[]>(this.configService.config.ovdimPnuim, { reportProgress: true, params: params }).pipe(
      tap((ovedpanui: IOvedPanui[]) => console.log(ovedpanui)),
      map(data => data)
    );

  }
  public updatesiduravoda(row: ITemplate, action: string, dtSidur: Date, id_yechida: number): Observable<any> {

    let data = {
      "action": action,
      "row":row,// JSON.stringify(row),
      "dtSidur": this.intl.formatDate(dtSidur, 'yyyy-MM-dd'),
      "id_yechida": id_yechida.toString()
    };
    const headers = new HttpHeaders().set("content-type", "application/json");
    return this.http.post(this.configService.config.updateSidurAvoda, data, { headers: headers }).pipe();

  }
  /*public updatesiduravoda(row: ITemplate, action: string, dtSidur: Date, id_yechida: number): Observable<any> {
    
    let shichrurData = {
      "action":action,
      "row": JSON.stringify(row),
      "dtSidur":this.intl.formatDate(dtSidur, 'yyyy-MM-dd'),
      "id_yechida": id_yechida.toString()
  };

    row.id_sidur_avoda = this.userData.KodSidurAvoda;

    let httpHeaders = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Cache-Control', 'no-cache')
      .set('Access-Control-Allow-Origin', 'http://localhost:4200/')
      .set('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');

    let params = JSON.stringify(row);
    return this.http.post<ITemplate[]>(
      this.configService.config.updateSidurAvoda + "?action=" + action + "&dtSidur=" +
      this.intl.formatDate(dtSidur, 'yyyy-MM-dd') + "&id_yechida=" + id_yechida.toString(),
      params, { headers: httpHeaders }).pipe(
      tap((sidravoda: ITemplate[]) => console.log(sidravoda)),
      map(data => data)
      )
  }*/
  public UpdateSiduravodaMishtana(id_yechida_mevazaat: number, dtSidur: Date, id_mesima: number): Observable<any> {

    let httpHeaders = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Cache-Control', 'no-cache');

    //let params = JSON.stringify(row);
    return this.http.post<ITemplate[]>(
      this.configService.config.updateSidurAvodaMishtana + "?id_yechida_mevazaat=" + id_yechida_mevazaat.toString() + "&dtSidur=" +
      this.intl.formatDate(dtSidur, 'yyyy-MM-dd') + "&id_mesima=" + id_mesima.toString(),
      null, { headers: httpHeaders }).pipe(
        tap((sidravoda: ITemplate[]) => console.log(sidravoda)),
        map(data => data)
      )
  }

  public getPeilutNidreshet(kod_mesima: string, id_peilut_nidreshet: number): Observable<IPeilutNidreshet> {
    let params = new HttpParams();
    params = params.append('kod_mesima', kod_mesima ? kod_mesima.toString() : null);
    params = params.append('id_peilut_nidreshet', id_peilut_nidreshet ? id_peilut_nidreshet.toString() : null);

    return this.http.get<IPeilutNidreshet>(this.configService.config.getPeilutNidreshet + "?kod_mesima=" + kod_mesima.toString() +
      "&id_peilut_nidreshet=" + id_peilut_nidreshet.toString()
    ).pipe();
  }
  //export const getDataTst = (data) => ({ data, mispar_pnimi_old: data.mispar_pnimi});
  public getallsiduravoda(isYechidaChanged: boolean, dtSidur: Date, Ymim: number, idYechidaMevazaat: number,
    idYechidaMekabelet: number, skip: number, take: number, screenPath: string): Observable<any> {
    //alert(this.router.url);
      let a = 1;
    let params = new HttpParams();
    //params = params.append('Ymim', Ymim.toString());
    params = params.append('Content-Type', 'application/json');
    params = params.append('isYechidaChanged', String(isYechidaChanged));

    params = params.append('dtSidur', this.intl.formatDate(dtSidur, 'yyyy-MM-dd'));
    params = params.append('Ymim', Ymim.toString());
    params = params.append('idYechidaMevazaat', idYechidaMevazaat.toString());
    params = params.append('idYechidaMekabelet', idYechidaMekabelet ? idYechidaMekabelet.toString() : null);
    params = params.append('skip', skip.toString());
    params = params.append('take', take.toString());
    params = params.append('screenPath', screenPath);
    let headers = new HttpHeaders();
    
    return this.http.get<any>(this.configService.config.allSidurAvoda, { params, headers }).pipe(
      //tap((mecholot: ITemplate[]) => console.log(mecholot)),
      map(data => {
        let newObj = data.Data as ITemplate[];
        let newData = newObj.map(obj => {
          // clone the current object
          const newObj = Object.assign({}, obj);
          // update the new object
          newObj.mispar_pnimi_old = newObj.mispar_pnimi;
          return newObj;
        });
        data.Data = newData;
        return data;
      })
      //map(data => (data as ITemplate).mispar_pnimi_old=(data as ITemplate).mispar_pnimi)
    )

  }
}
