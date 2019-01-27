import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IntlService } from '@progress/kendo-angular-intl';
import { SpaConfigService } from 'src/spa';
import { map } from 'rxjs/internal/operators/map';
import { Observable } from 'rxjs-compat/Observable';
import { tap } from 'rxjs/internal/operators/tap';
import { IPirteiOved } from '../types/pirtei_oved';

@Injectable({
  providedIn: 'root'
})
export class OvedService {

  constructor(private http: HttpClient,
    private intl: IntlService,
    private configService: SpaConfigService) { }
    public GetOvedById(k_user:number): Observable<any> {
    
      let params = new HttpParams();
      params = params.append('k_user', k_user ? k_user.toString() : null);
      return this.http.get<IPirteiOved[]>(this.configService.config.getOvedById,
         {  params: params }).pipe(
        tap((pirteioved: IPirteiOved[]) => console.log(pirteioved)),
        map(data => data)
      );
   
    }
    public GetOvdimByName(full_name:string): Observable<any> {
      let params = new HttpParams();
      params = params.append('full_name', full_name ? full_name.toString() : null);
      return this.http.get<IPirteiOved[]>(this.configService.config.getOvdimByName,
         {  params: params }).pipe(
        tap((pirteioved: IPirteiOved[]) => console.log(pirteioved)),
        map(data => data)
      );

    }
    public GetPoalimNehagimByYechida(kod_yechida: number,kolelLoPeilim:boolean): Observable<any> {
      let params = new HttpParams();
      params = params.append('kod_yechida', kod_yechida ? kod_yechida.toString() : null);
      params = params.append('kolelLoPeilim',String(kolelLoPeilim));
      return this.http.get<IPirteiOved[]>(this.configService.config.getPoalimNehagimByYechida,
        {  params: params } 
        ).pipe(
        tap((pirteioved: IPirteiOved[]) => console.log(pirteioved)),
        map(data => data)
      );
    }
    
}
