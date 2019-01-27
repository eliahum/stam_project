import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { SpaConfigService } from 'src/spa';
import { IYechidaIrgunit, KeyValuePair, ComboItem, ISibatHeadrut, YechidaService, SidurAvodaService, TikuneiRechevService, MesimaService } from '../..';
import { UserDataService } from 'src/app/shared/services/user-data.service';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class DictionaryService {
  public _startupData: KeyValuePair[] = [];
  YechidaList: IYechidaIrgunit[];
  sibotHeadrut: ComboItem[] = [];
  headruyot: ISibatHeadrut[];

  constructor(private srv: YechidaService,
    private userData: UserDataService,
    private sidurSrv: SidurAvodaService,
    private configService: SpaConfigService,
    private tikunService: TikuneiRechevService,
    private mesimaService: MesimaService
  ) {


  }
  public AddHeadrut(item: ISibatHeadrut) {
    var p = { text: item.t_sibat_headr_ed_mef, value: item.id_sug_headrut };
    this.sibotHeadrut.push(p);
  }
  load(): Promise<any> {

    //this.userData.TaarichSidur=moment("2018-07-02").toDate();
    return new Promise((resolve, reject) => {
      this.configService.load().then(() => {
        this.userData.load().then(() => {

          resolve();

          /* this.srv.getYechidot(false, 0, 1000).
             subscribe(yechidot => {
               //        this.userData.TaarichSidur=moment("2018-07-02").toDate();
               //if (!this._startupData){  
               let dd = { key: "yechidot", value: yechidot.Data };
               this._startupData.push(dd);
               //}             
             },
               error => console.log(error),
             );
 
           this.sidurSrv.GetSugeiMesimaForUpdateKamut().
             subscribe(sugim => {
               this._startupData.push({ key: "sugei_mesima_forupdate_kamut", value: sugim.Data });
               resolve();
             },
               error => console.log(error),
             );
           this.sidurSrv.GetStatusesMesima().
             subscribe(status => {
 
               this._startupData.push({ key: "status_mesima", value: status });
               resolve();
             },
               error => console.log(error),
             );
           this.tikunService.GetGormimMetaknim().
             subscribe(gorem => {
 
               this._startupData.push({ key: "gormim_metaknim", value: gorem });
               resolve();
             },
               error => console.log(error),
             );
           this.sidurSrv.GetSibotHeadruyot().subscribe(sibot => {
             this.headruyot = sibot;
             this.headruyot.map(item => this.AddHeadrut(item));
             //sibot.map(item => {this.AddHeadrut(item)});
             this._startupData.push({ key: "sibot_headrut", value: this.sibotHeadrut as any });
             resolve();
           },
             error => console.log(error),
           )*/
        });
      });
    });


  }
  getData<T>(key: string): Observable<any> {
    let parentThis = this;
    return new Observable((observer) => {
      let data = parentThis.startupData.filter(x => x.key == key)[0];
      console.log(key);
      if (data) observer.next(data.value);
      else {
        switch (key) {
          case "sibot_headrut":
            this.sidurSrv.GetSibotHeadruyot().subscribe(result => {
              result.map(item => this.AddHeadrut(item));
              parentThis.startupData.push({ key: key, value: this.sibotHeadrut as any });
              observer.next(this.sibotHeadrut);
            }, error => {
              observer.error(error);
            });
            break;
          case "gormim_metaknim":
            this.tikunService.GetGormimMetaknim().subscribe((result) => {
              parentThis.startupData.push({ key: key, value: result });
              observer.next(result);
            }, error => {
              observer.error(error);
            });
            break;
          case "sugei_mesimot":
            this.mesimaService.GetSugeiMesimot().subscribe((result) => {
              parentThis.startupData.push({ key: key, value: result });
              observer.next(result);
            }, error => {
              observer.error(error);
            });
            break;
          case "kodei_mesimot":
            this.mesimaService.GetKodeiMesimot().subscribe((result) => {
              parentThis.startupData.push({ key: key, value: result });
              observer.next(result);
            }, error => {
              observer.error(error);
            });
            break;
          case "status_mesima":
            this.sidurSrv.GetStatusesMesima().subscribe(result => {
              parentThis.startupData.push({ key: key, value: result });
              observer.next(result);
            }, error => {
              observer.error(error);
            });
            break;
          case "sugei_mesima_forupdate_kamut":
            this.sidurSrv.GetSugeiMesimaForUpdateKamut().subscribe(result => {
              parentThis.startupData.push({ key: key, value: result });

              observer.next(result);
            }, error => {
              observer.error(error);
            });

            break;
          case "yechidot":
            this.srv.getYechidot(false, 0, 1000).subscribe(result => {
              parentThis.startupData.push({ key: key, value: result.Data });

              observer.next(result.Data);
            }, error => {
              observer.error(error);
            });

            break;
        }
      }
    });
  }
  get startupData(): any {
    return this._startupData;
  }
  set SetStartupData(value: KeyValuePair[]) {
    this._startupData = value;
  }


}
