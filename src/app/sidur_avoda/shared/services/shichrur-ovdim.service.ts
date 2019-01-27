import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { IntlService } from '@progress/kendo-angular-intl';
import { SpaConfigService } from 'src/spa';
import { map } from 'rxjs/internal/operators/map';
import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/internal/operators/tap';
import { ShichrurOved } from '../..';

@Injectable({
  providedIn: 'root'
})
export class ShichrurOvdimService {

  constructor( private http: HttpClient, private intl: IntlService,
    private configService: SpaConfigService) { }
    public GetShichrurOvdim(
      skip: number, take: number,meTaarich: Date,adTaarich:Date,
      yechidaKvuaID?: number,ovedId?: number
    ): Observable<any> {
      let params = new HttpParams();
      params = params.append('skip', skip.toString());
      params = params.append('take', take.toString());
      params = params.append('meTaarich', this.intl.formatDate(meTaarich, 'yyyy-MM-dd'));
      params = params.append('adTaarich', this.intl.formatDate(adTaarich, 'yyyy-MM-dd'));
      params = params.append('yechidaKvuaID', yechidaKvuaID ? yechidaKvuaID.toString() : null);
      params = params.append('ovedId', ovedId ? ovedId.toString() : null);
  
      return this.http.get<ShichrurOved[]>(this.configService.config.getShichrurOvdim,
        {  params: params }).pipe(
       tap((pirteioved: ShichrurOved[]) => console.log(pirteioved)),
       map(data => data)
     );
      
    }
    public InsertShichrurOved(shichrurOved: ShichrurOved | any) : Observable<any> {
    
      const headers = new HttpHeaders().set("content-type", "application/json");
      return this.http.post(this.configService.config.insertShichrurOved,shichrurOved,{headers:headers}).pipe();
  
    }
    public UpdateShichrurOved(shichrurOved: ShichrurOved | any) : Observable<any> {
    
      const headers = new HttpHeaders().set("content-type", "application/json");
      return this.http.post(this.configService.config.updateShichrurOved,shichrurOved,{headers:headers}).pipe();
  
    }
    public IsShichrurValid(shichrurOved: ShichrurOved | any) : Observable<any> {   
      const headers = new HttpHeaders().set("content-type", "application/json");
      return this.http.post(this.configService.config.isShichrurValid,shichrurOved,{headers:headers}).pipe();
    }
    
    public CheckIfOvedMeshubatz(shichrurOved: ShichrurOved | any) : Observable<any> {   
      const headers = new HttpHeaders().set("content-type", "application/json");
      return this.http.post(this.configService.config.checkIfOvedMeshubatz,shichrurOved,{headers:headers}).pipe();
    }
    
}
