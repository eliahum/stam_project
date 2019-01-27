import { Injectable } from '@angular/core';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/internal/operators/map';
import { INochechut } from '../../index';
import { IntlService } from '@progress/kendo-angular-intl';

import { SpaConfigService } from 'src/spa';
import { UserDataService } from 'src/app/shared/services/user-data.service';

@Injectable()
export class NochechutOvedService {
  private host = "localhost";
  //private _nochechutOvdimUrl = 'http://' + this.host + '/Tlv.Tavrua.Api/api/SidurAvoda/GetNochechutOvim';
  //private _nochechutOvedUrl = 'http://' + this.host + '/Tlv.Tavrua.Api/api/SidurAvoda/GetNochechutOved';

  //private _saveHeadrut = 'http://' + this.host + '/Tlv.Tavrua.Api/api/SidurAvoda/SaveHeadrut';

  constructor(private http: HttpClient,
    private userData: UserDataService,
    private intl: IntlService,
    private configService:SpaConfigService
  ) { }

  public SaveHeadrut(fromDate: Date, toDate: Date, k_user: number, id_yechida: number,heara:string, id_sug_headrut: number): Observable<any> {

      var data = {
        "fromDate": this.intl.formatDate(fromDate, 'yyyy-MM-dd'),
        "toDate": this.intl.formatDate(toDate, 'yyyy-MM-dd'),
        "k_user": k_user.toString(),
        "id_yechida":  id_yechida.toString(),
        "heara": (heara ? heara.toString() : ""),
        "id_sug_headrut":id_sug_headrut? id_sug_headrut.toString():null
      };

      const headers = new HttpHeaders().set("content-type", "application/json");
      return this.http.post(this.configService.config.saveHeadrut, data, { headers: headers }).pipe();

    
  }
  public GetNochechutOvim(
    skip: number, take: number,dtSidur: Date, id_yechida?: number
  ): Observable<any> {
    let params = new HttpParams();
    params = params.append('skip', skip.toString());
    params = params.append('take', take.toString());
    params = params.append('id_yechida', id_yechida ? id_yechida.toString() : null);
    params = params.append('dt', this.intl.formatDate(dtSidur, 'yyyy-MM-dd'));
    

    return this.http.get<any>(this.configService.config.nochechutOvdimUrl, { params: params }).pipe(
      //tap((nochechut: INochechut[]) => console.log(nochechut)),
      map(data => {
        let newObj = data.Data as INochechut[];
        let newData = newObj.map(obj => {
          // clone the current object
          const newObj = Object.assign({}, obj);
          newObj.comboheadrut_vis = false;
          // update the new object
          return newObj;
        });
        data.Data = newData;
        return data;
      })
    )
  }
  public GetNochechutOved(
    skip: number, take: number,k_user:number, id_yechida?: number, dt?: Date
  ): Observable<any> {
    let params = new HttpParams();
    params = params.append('skip', skip.toString());
    params = params.append('take', take.toString());
    params = params.append('k_user', k_user.toString());
    params = params.append('id_yechida', id_yechida ? id_yechida.toString() : null);
    params = params.append('dt', this.intl.formatDate(dt, 'yyyy-MM-dd'));
    //return new Promise((resolve, reject) => {
      return this.http.get<any>(this.configService.config.nochechutOvedUrl, { params: params }).pipe
      (
        map(data => {
          let newObj = data.Data as INochechut[];
          let newData = newObj.map(obj => {
            // clone the current object
            const newObj = Object.assign({}, obj);
            newObj.comboheadrut_vis = false;
            // update the new object
            return newObj;
          });
          data.Data = newData;
          return data;

        })

      );
      /*.subscribe(row=>{
        resolve(row);
      }, error => {
        reject(error)
      });*/
   // });
  }

}