
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MidaNosaf, NochechutOvedService, ISibatHeadrut, ComboItem, SidurAvodaService, SugYechida, YachidaIrgunitCode, Peula, ITemplate, Sug_Mahut, ISugMesimaForUpdateKamut } from '../../index';
import { IntlService } from '@progress/kendo-angular-intl';
import { mapTo, delay } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { DictionaryService } from '../../shared/services/dictionary.service';
import { UserDataService } from 'src/app/shared/services/user-data.service';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import { forkJoin } from "rxjs/observable/forkJoin";



@Component({
  selector: 'mida-nosaf-ng',
  templateUrl: 'mida-nosaf-ng.component.html',
  styleUrls: ['mida-nosaf-ng.component.scss']
})
export class MidaNosafNgComponent implements OnInit {
  public HEADRUT_SHABAT_HAG_ERROR: string = "לא ניתן לשבץ העדרות בתקופה המכילה שבת/חג";
  public HEADRUT_OVED_MENOYAD_ERROR: string = "לא ניתן לשבץ העדרות לעובד מסוג 'אחר' או לעובד שנויד מיחידה אחרת";
  public HEADRUT_QUESTION_UPDATE: string = "האם לשמור נתונים ולמחוק את השיבוץ הקיים בתקופה המבוקשת ? " + "<br>" +
    "שים לב, " + "<br>" + "במידה וקיימים ימים סגורים בטווח הנבחר,המערכת לא תתיחס לאותם תאריכים.";

  public info: string = '';
  public lblHeara: string = '';
  public lblKamut: string = '';
  public IsHeadrut: boolean = true;
  public HasOvedTitle: boolean = false;
  public IsPremia: boolean = true;
  public IsMale: boolean = true;
  public kamut: number = 0;


  public disabled: boolean = false;
  public disabledPremia: boolean = false;


  display: boolean = false;
  @Output()
  onSaveComp: EventEmitter<MidaNosaf> = new EventEmitter();
  @Input()
  midaNosafData: MidaNosaf;
  @Input()
  isSaveMessage: boolean = true;
  @Input()
  curSidur: ITemplate;
  @Input()
  IsReadOnly: boolean = true;
  @Input()
  public dtHeadrutMe: Date = new Date(2018, 5, 3);
  @Input()
  public dtHeadrutAd: Date = new Date(2018, 5, 3);
  headruyot: ISibatHeadrut[];
  public selectedItem: ComboItem = null;
  public listItems: ComboItem[] = [

  ];

  constructor(private srv: SidurAvodaService,
    private nochechutSrv: NochechutOvedService,
    private dictSrv: DictionaryService,
    private messageService: MessageService,
    private intl: IntlService, private toastr: ToastrService,
    private userData: UserDataService) {
    this.midaNosafData = new MidaNosaf(new Date(2018, 1, 1), new Date(2018, 1, 1), false, false, 0);//, "71");


  }
  onChange(item: ComboItem) {
    this.selectedItem = { text: item.text, value: item.value };
  }

  ngOnDestroy() {

  }
  ngOnInit() {
    this.srv.GetSibotHeadruyot().pipe(delay(10)).subscribe(sibot => {
      this.headruyot = sibot;
      this.headruyot.map(item => this.AddHeadrut(item));


    },
      error => console.log(error),
    )

  }
  public AddHeadrut(item: ISibatHeadrut) {
    var p = { text: item.t_sibat_headr_ed_mef, value: item.id_sug_headrut };
    this.listItems.push(p);
  }

  public isYechidaMetapeletHanion(yechidot: any, yechida: any): boolean {
    let oldThis = this;
    /*let result = this.linq.Enumerable().From(yechidot)
      .Where(function (x) {
        return x.id_sug_yechida == SugYechida.Hanion &&
          x.kod_yechida == yechida
      }).ToArray();*/
    let result = yechidot.filter(function (x) {
      return x.id_sug_yechida == SugYechida.Hanion &&
        x.kod_yechida == yechida
    });
    return result.length > 0;
  }
  CheckSugMesimaForUpdateKamut(list: ISugMesimaForUpdateKamut[], SugMesima: string) {
    let result = list.filter(function (x) {
      return x.kod_sug == SugMesima
    });
    /*let result = this.linq.Enumerable().From(list)
      .Where(function (x) {
        return x.kod_sug == SugMesima
      }).ToArray();*/
    return result.length > 0;
  }
  SetHeadrutPopUp(txt: string, enableHeadrut: boolean, nehigaTahana: boolean) {
    this.disabled = !nehigaTahana;
    this.disabledPremia = !nehigaTahana;


    this.HasOvedTitle = enableHeadrut;
    this.IsHeadrut = enableHeadrut;
    this.info = txt ? txt.trim() : '';
  }
  CheckKamutVal1(val: number) {
    let decimalAsInt = Math.round((val - Math.floor(val)) * 10);
    return decimalAsInt == 5 || decimalAsInt == 0;
  }
  CheckKamut() {
    let result = true;
    let kamut = this.midaNosafData.Kamut;
    let decimalAsInt = Math.round((kamut - Math.floor(kamut)) * 10);
    let SugMesima = parseInt(this.curSidur.kod_mesima.substr(2, 2));
    if (SugMesima != 50 && SugMesima != 51 && SugMesima != 52 && SugMesima != 53
      && SugMesima != 54 && SugMesima != 55) {

      if (decimalAsInt > 0) {
        this.messageService.add({ key: 'success', severity: 'error', life: 2000, detail: 'יש להזין בכמות מספרים שלמים בלבד' });
        result = false;
      }
    }
    else {

      if (!this.CheckKamutVal1(kamut)) {
        this.messageService.add({ key: 'success', severity: 'error', life: 2000, detail: 'במשימות פינוי מכולות יש להזין בכמות מספרים שלמים או חצאים בלבד' });
        result = false;
      }
    }
    return result;

  }
  onSaveClick() {
    let kamut = this.curSidur.kamut;
    if (kamut < 0 || kamut > 60) {
      this.messageService.add({ key: 'success', severity: 'error', life: 2000, detail: 'כמות חייבת להיות בטווח בין 0 עד 60' });

      return;
    }
    if (!this.CheckKamut()) {
      return;
    }
    if (this.IsHeadrut) {
      this.nochechutSrv.SaveHeadrut(this.midaNosafData.dtHeadrutMe, this.midaNosafData.dtHeadrutAd,
        this.curSidur.k_user, this.userData.IdYechidaMevatzat, "", this.selectedItem ? this.selectedItem.value : null).
        subscribe(rows => {
          let hodaa = '';
          if (rows == 2) {
            hodaa = this.HEADRUT_SHABAT_HAG_ERROR;
          }
          else if (rows == 3) {
            hodaa = this.HEADRUT_OVED_MENOYAD_ERROR;
          }
          else if (rows == 4) {
            hodaa = this.HEADRUT_QUESTION_UPDATE;
          }
          if (this.isSaveMessage)
            this.messageService.add({ key: 'success', severity: 'success', life: 2000, detail: hodaa });

          this.midaNosafData.OvedId = this.curSidur.k_user;

          this.onSaveComp.emit(this.midaNosafData);
          this.display = false;

        },
          error => {
            //  if (this.isSaveMessage)
            this.messageService.add({ key: 'success', severity: 'error', life: 2000, detail: error.message });
            throw error;
          }

        );
    }
    //alert('saved');

  }
  
  public getAllAsyncData():Observable<any> {
    return new Observable((observer)=>{
      this.dictSrv.getData<any>("yechidot").subscribe(result_yechidot=>{
        this.dictSrv.getData<any>("sugei_mesima_forupdate_kamut").subscribe(result_kamut=>{
          observer.next([result_yechidot,result_kamut]);
        });
      })
    });
    ;
    ;
    
  }
  showDialog() {

    this.display = true;
    let yechidaName = this.curSidur.yechida;
    let ovedName = this.curSidur.full_name;
    ovedName = ovedName ? ovedName : '';
    let textInfo = ovedName.replace("'", "`") + " " + yechidaName + " " +
      this.intl.formatDate(this.userData.TaarichSidur, 'dd/MM/yyyy');
    let SugMesima = this.curSidur.kod_mesima.substr(2, 2);
    let isSevav = this.curSidur.isSevav;
    if (this.curSidur.k_user) {
      console.log('k_user');
   
      this.getAllAsyncData()
              .subscribe(([yechidot,sugei_mesima_forupdate_kamut]) => {
     
        this.lblKamut = (isSevav == 1) ? 'סבבים' : 'כמות';


        if (this.curSidur.id_sug_mahot_mesima == Sug_Mahut.SUG_MAHUT_HAAVARA) {
          this.lblHeara = 'הערת חניון:';
          this.midaNosafData.Heara = this.curSidur.hearaHanion;
        }
        else {
          this.lblHeara = 'הערת תחנה:';
          this.midaNosafData.Heara = this.curSidur.hearaTahana;
        }

        let kSugMesima = parseInt(this.curSidur.k_sug_mesima);

        if ((kSugMesima == 98 || kSugMesima == 99 || (kSugMesima >= 70 && kSugMesima <= 79))) {
          this.IsMale = true;
        }
        else {
          this.IsMale = false;
        }

        //אם יחידה מטפלת חניון
        if (this.isYechidaMetapeletHanion(yechidot, this.userData.KodYechidaMevatzat)) {
          if (this.userData.KodYechidaMevatzat == YachidaIrgunitCode.Hanion) {
            this.SetHeadrutPopUp(textInfo, true, false);
          }
          else if (this.userData.KodYechidaMevatzat == YachidaIrgunitCode.TiutShinua) {
            if (this.CheckSugMesimaForUpdateKamut(sugei_mesima_forupdate_kamut, SugMesima)) {
              this.SetHeadrutPopUp(textInfo, true, true);
            }
            else {
              this.SetHeadrutPopUp(textInfo, true, false);
            }
          }
          else {
            if (this.curSidur.id_sug_peilut == Peula.Action.Nehiga) {
              this.SetHeadrutPopUp(textInfo, false, true);
            }
            else {
              this.SetHeadrutPopUp(textInfo, true, true);
            }
          }
        }
        //אסור לשנות העדרות לנהג בתחנה
        else {
          if (this.curSidur.id_sug_peilut == Peula.Action.Nehiga) {
            this.SetHeadrutPopUp(textInfo, false, true);
          }
          else {
            this.SetHeadrutPopUp(textInfo, true, true);
          }
        }
      }, err => {
        alert(err);
      });
    }
    //ניקוי כל הערכים כאשר משתמש לא נבחר
    else {
      this.SetHeadrutPopUp(textInfo, false, false);
    }
  }
}
