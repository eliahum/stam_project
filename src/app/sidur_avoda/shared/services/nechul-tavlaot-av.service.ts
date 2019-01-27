import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { IntlService } from '@progress/kendo-angular-intl';
import { SpaConfigService } from 'src/spa';
import { map } from 'rxjs/internal/operators/map';
import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/internal/operators/tap';
import { filter } from 'rxjs/internal/operators/filter';
import {TavlaotAv} from '../types/tavlaot-av';
import {KeyValuePair} from '../..';


@Injectable({
  providedIn: 'root'
})
export class NechulTavlaotAvService {

  constructor( private http: HttpClient, private intl: IntlService,
    private configService: SpaConfigService) { }
    public GetNechulTavlaotAv(
      gridQueryStr: string, zmanHatchala: Date, zmanSof: Date,
      swPail?: number, tableId?: number
    ): Observable<any> {
      let params = new HttpParams();
      // params = params.append('gridQueryStr',gridQueryStr);
      params = params.append('zman_hatchala', this.intl.formatDate(zmanHatchala, 'yyyy-MM-dd'));
      params = params.append('zman_sof', this.intl.formatDate(zmanSof, 'yyyy-MM-dd'));
      params = params.append('sw_pail', swPail.toString());
      params = params.append('tableId', tableId.toString());
      params = params.append('is_search', "1");
  
     // return this.http.get<TavlaotAv[]>(this.configService.config.getTavlaotAv,
     //   return this.http.get<any>("http://localhost:3000/tavlaotAv",
     return this.http.get<any>(`http://localhost/Tlv.Tavrua.Api/api/PremiaTavlotAv/GetPremiaTavlotAv?${gridQueryStr}`,
        { params: params }).pipe(
       tap((tavlaatAv) =>{ console.log(tavlaatAv)}),
       map(data => data )
     );
      
    }
    public InsertTavlaotAv(tavlaotAv: TavlaotAv | any) : Observable<any> {
     
      const headers = new HttpHeaders().set("content-type", "application/json");
     // return this.http.post(this.configService.config.insertTavlaotAv,tavlaotAv,{headers:headers}).pipe();
      return this.http.post("http://localhost/Tlv.Tavrua.Api/api/PremiaTavlotAv/InsertPremiaTavlotAv",tavlaotAv,{headers:headers}).pipe();
  
    }
    public UpdateTavlaotAv(tavlaotAv: TavlaotAv | any) : Observable<any> { 
      const headers = new HttpHeaders().set("content-type", "application/json");
      //return this.http.post(this.configService.config.updateTavlaotAv,tavlaotAv,{headers:headers}).pipe();
      return this.http.put(`http://localhost:3000/tavlaotAvInsert/${tavlaotAv.id_premia_tavlat_av}`,tavlaotAv,{headers:headers}).pipe();
    } 
    public DeleteTavlaotAv(tavlaotAv: TavlaotAv | any) : Observable<any> { 
      const headers = new HttpHeaders().set("content-type", "application/json");
      //return this.http.post(this.configService.config.updateTavlaotAv,tavlaotAv,{headers:headers}).pipe();
      return this.http.delete(`http://localhost:3000/tavlaotAvInsert/${tavlaotAv.id_premia_tavlat_av}`,{headers:headers}).pipe();
    } 
    public GetSugeiPremiaTavlaotAv(): Observable<Array<KeyValuePair>> {
     // return this.http.get<TavlaotAv[]>(this.configService.config.getTavlaotAv,
     // return this.http.get<Array<KeyValuePair>>("http://localhost:3000/sugeyPremiaTavlaatAv").pipe(
      return this.http.get<Array<KeyValuePair>>("http://localhost/Tlv.Tavrua.Api/api/PremiaTavlotAv/GetSugeiPremiaTavlotAv").pipe(
       tap((sugeyPremiaTavlaatAv) =>{ console.log(sugeyPremiaTavlaatAv)}),
       map(data => data )
     );
      
    } 
   // checkKodMesimaExistsTaken 
   public checkKodMesimaTaken(kodMesima: string) {
    
    return this.http
      .get<{ [key: string]: any } | null>(`http://localhost:3000/kodeyMesima?kodMesima=${kodMesima}`).pipe(
          tap((tavlatAv) =>{ console.log(tavlatAv)}),
          map(tavlatAv => (tavlatAv.length) ?  { 'kodMesimaExists': true} : null )
      );
  }
}
