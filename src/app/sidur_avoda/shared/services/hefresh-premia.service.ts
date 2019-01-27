import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IntlService } from '@progress/kendo-angular-intl';
import { SpaConfigService } from 'src/spa';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/internal/operators/map';
import { tap } from 'rxjs/internal/operators/tap';


@Injectable({
  providedIn: 'root'
})
export class HefreshPremiaService {

  constructor( private http: HttpClient, private intl: IntlService,
    private configService: SpaConfigService) { }
    public GetHefresheiPremiot(
      skip?:number,pageSize?:number,
      yechidaId?: number, userID?: number,Year?: number,MeHodesh?: number,AdHodesh?: number,
      Pail?:number
    ): Observable<any> {
      let params = new HttpParams();
      params = params.append('skip', skip.toString());
      params = params.append('take', pageSize.toString());
      params = params.append('yechidaId',yechidaId? yechidaId.toString():null);
      params = params.append('userID',userID? userID.toString():null);
      params = params.append('Year',Year? Year.toString():null);
      params = params.append('MeHodesh',MeHodesh? MeHodesh.toString():null);
      params = params.append('AdHodesh',AdHodesh? AdHodesh.toString():null);
      params = params.append('Pail',Pail? Pail.toString():null);
      return this.http.get<any>(this.configService.config.getHefresheiPremiot,
        { params: params }).pipe(
       tap((hefresh) =>{ console.log(hefresh)}),
       map(data => data )
     );
      
    }
    public GetHefreshPremia(
      skip: number, take: number
    ): Observable<any> {
      let params = new HttpParams();
      params = params.append('skip', skip.toString());
      params = params.append('take', take.toString());
        return this.http.get<any>("http://localhost:3000/hefresh_premia",
        { params: params }).pipe(
       tap((hefresh) =>{ console.log(hefresh)}),
       map(data => data )
     );
      
    }
}
