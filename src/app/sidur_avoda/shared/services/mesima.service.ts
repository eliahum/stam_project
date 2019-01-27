import { ComboItem } from './../types/combo-item';
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { IntlService } from '@progress/kendo-angular-intl';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/internal/operators/map';
import { SpaConfigService } from 'src/spa';
import { SugMesima } from './../types/sug-mesima';
import { tap } from 'rxjs/internal/operators/tap';
import {Filter, ISugMesima} from '../..';


@Injectable()
export class MesimaService {

  constructor(private http: HttpClient, private intl: IntlService,
    private configService: SpaConfigService) { }
  public UpdateMesima(OvedShibutzKavuaId: number, SugPeulaId: number, MesimaId: number,
    id_peilot_lemesima: number, id_peilot_meshubetzet: number): Observable<any> {

    let data = {
      "OvedShibutzKavuaId": OvedShibutzKavuaId,
      "SugPeulaId": SugPeulaId ? SugPeulaId.toString() : null,// JSON.stringify(row),
      "MesimaId": MesimaId ? MesimaId.toString() : null,
      "id_peilot_lemesima": id_peilot_lemesima ? id_peilot_lemesima.toString() : null,
      "id_peilot_meshubetzet": id_peilot_meshubetzet ? id_peilot_meshubetzet.toString() : null
    };
    const headers = new HttpHeaders().set("content-type", "application/json");
    return this.http.post(this.configService.config.updateMesima, data, { headers: headers }).pipe();
  }

  public GetKodeiMesimot(): Observable<any> {
    return this.http.get<SugMesima[]>(this.configService.config.getKodeiMesimot).pipe(
      tap((sibot: SugMesima[]) => console.log(sibot)));
  }
  public GetSugeiMesimot(): Observable<any> {
    return this.http.get<SugMesima[]>(this.configService.config.getSugeiMesimot).pipe(
      tap((sibot: SugMesima[]) => console.log(sibot)),
      map(data => {
        let newObj = data as SugMesima[];
        let newData = newObj.map(obj => {
          let newObjLast = new SugMesima();
          // clone the current object
          const curObj = Object.assign({}, obj);
          newObjLast.teur_sug_mesima = curObj.teur_sug_mesima;
          newObjLast.teur_male_sug_mesima = curObj.teur_male_sug_mesima;
          newObjLast.k_sug_mesima = Number(curObj.k_sug_mesima);
          return newObjLast;
        });
        return newData;
      })
    )
  }

  
  public getSugeyMesima(skip: number, take: number,
    filters?: Filter[],
    sortOrder?: number, sortField?: string): Observable<any> {
  
    let params = new HttpParams();
    params = params.append('skip', skip.toString());
    params = params.append('take', take.toString());;     
    params = params.append('filters', filters ? JSON.stringify(filters) : null);
    params = params.append('sortOrder', sortOrder ? sortOrder.toString() : null);
    params = params.append('sortField', sortField ? sortField.toString() : '');
    
   // return this.http.get<ISugMesima[]>(this.configService.config.sugeyMesima, { params: params }).pipe(
    return this.http.get("http://localhost:3000/sugeyMesima", { params: params }).pipe(
      tap((sugMesima: ISugMesima[]) => console.log(sugMesima)),
      map(data => data)
    )
  }


}
