import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/internal/operators/tap';
import { map } from 'rxjs/internal/operators/map';

import { SpaConfigService } from 'src/spa';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient,private configService:SpaConfigService) { }
  public GetUserData(): Observable<any> {
    return this.http.get(this.configService.config.getUserData).pipe(
      map(data => data)
    )
  }
  public GetUserHarshaa(routeName:string): Observable<any> {
    let params = new HttpParams();
    params = params.append('routeName', routeName);
    return this.http.get(this.configService.config.getUserHarshaa,
       {  params: params }).pipe(
      map(data => data)
    );
 
  }
}
