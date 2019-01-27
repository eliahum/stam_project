import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { IntlService } from '@progress/kendo-angular-intl';
import { SpaConfigService } from 'src/spa';
import { map } from 'rxjs/internal/operators/map';
import { Observable } from 'rxjs/Observable';
import { TvrTikunRechev } from '../..';
import { GoremMetaken } from '../types/gorem-metaken';

@Injectable({
  providedIn: 'root'
})
export class TikuneiRechevService {

  constructor( private http: HttpClient, private intl: IntlService,
    private configService: SpaConfigService) { }

    public GetTikuniRechev(
      skip: number, take: number,
      rechevId?:string,meTaarich?: Date,nahagId?: number,
      goremMedaveahId?: number,isFixed?:number
    ): Observable<any> {
      let params = new HttpParams();
      params = params.append('rechevId', rechevId ? rechevId.toString() : null);
      params = params.append('meTaarich', this.intl.formatDate(meTaarich, 'yyyy-MM-dd'));
      params = params.append('nahagId', nahagId ? nahagId.toString() : null);
      params = params.append('goremMedaveahId', goremMedaveahId ? goremMedaveahId.toString() : null);
      params = params.append('isFixed', isFixed ? isFixed.toString() : null);
      params = params.append('skip', skip.toString());
      params = params.append('take', take.toString());  
      return this.http.get<any[]>(this.configService.config.getTikuneiRechev,
        {  params: params }).pipe(
           map(data => data)
        );
      
    }
    public getNehagimMaavirimLeTikum(skip: number, take: number): Observable<any>{
      let params = new HttpParams();
      params = params.append('skip', skip.toString());
      params = params.append('take', take.toString()); 
      return this.http.get<any[]>(this.configService.config.getNehagimMaavirimLeTikum,
        {  params: params }).pipe(
           map(data => data)
        );
      
    }
    public GetTikunRechev(
      tikunId: number
    ): Observable<any> {
      let params = new HttpParams();
      params = params.append('tikunId', tikunId ? tikunId.toString() : null);

      return this.http.get<any[]>(this.configService.config.getTikunRechev,
        {  params: params }).pipe(
           map(data => data)
        );
      
    }

    public GetGormimMetaknim(): Observable<any> {



      return this.http.get<GoremMetaken[]>(this.configService.config.getGormimMetaknim).pipe(
        map(data => data)
      )
    }
    public InsertTikuneiRechev(tikunRechev: TvrTikunRechev) : Observable<any> {
    
      const headers = new HttpHeaders().set("content-type", "application/json");
      
      tikunRechev.ZmanHatchala =new Date(this.intl.formatDate(tikunRechev.ZmanHatchala, 'yyyy-MM-dd'));
      return this.http.post(this.configService.config.insertTikuneiRechev,tikunRechev,{headers:headers}).pipe();
  
    }
    public CheckBeforeInsertTikuneiRechev(tikunRechev: TvrTikunRechev) : Observable<any> {
    
      const headers = new HttpHeaders().set("content-type", "application/json");
      
      tikunRechev.ZmanHatchala =new Date(this.intl.formatDate(tikunRechev.ZmanHatchala, 'yyyy-MM-dd'));
      return this.http.post(this.configService.config.checkBeforeInsertTikuneiRechev,tikunRechev,{headers:headers}).pipe();
  
    }
   
  
    public UpdateTikuneiRechev(tikunRechev: TvrTikunRechev) : Observable<any> {    
      const headers = new HttpHeaders().set("content-type", "application/json");
      return this.http.post(this.configService.config.updateTikuneiRechev,tikunRechev,{headers:headers}).pipe();
  
    }
    
}
