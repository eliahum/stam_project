import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { SafeStyle } from '@angular/platform-browser';
import { LazyLoadEvent, FilterMetadata, DialogService } from 'primeng/primeng';
import * as $ from "jquery";
import { ITemplate, SidurAvodaService, SearchSidurParams, Filter, Sug_Mahut, ButzaStatus, IOvedPanui, IRechevPanui, MidaNosaf, IYechidaIrgunit, DayOfWeek, Yamim, NihulPremiaService, MesimaService } from '../../index';
import {  ToastrService } from 'ngx-toastr';
import { MishtanaNgComponent } from '../../components/mishtana-ng/mishtana-ng.component';
import { MessageService } from 'primeng/api';
import { Router, ActivatedRoute } from '@angular/router';
import { CanComponentDeactivate } from '../../shared/services/can-deactivate-guard.service';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';


import { DatePipe } from '@angular/common';

import {
  OvedNgComponent, RechevNgComponent, MidaNosafNgComponent, ShinuiKavuaNgComponent,
  HearatSidurComponent,
  YesNoDialogComponent
} from '../../components';
import { UserDataService } from 'src/app/shared/services/user-data.service';
import { BasePageSidurComponent } from '../base-page-sidur/base-page-sidur-component';


@Component({
  selector: 'sidur-avoda-ng',
  templateUrl: 'sidur-avoda-ng.component.html',
  styleUrls: ['sidur-avoda-ng.component.scss']

})
export class SidurAvodaNgComponent extends BasePageSidurComponent implements OnInit, CanComponentDeactivate {
  hi: any;
  today: any;
  HearatSidur: string;

  
  canDeactivate(): boolean | Promise<boolean> {
    return confirm("test?");
  }
  colsWidths = [
    { field: 'vin', header: 'פעיל', width: '30px' },
    { field: 'year', header: 'סדר', width: '30px' },
    { field: 'brand', header: 'איזור', width: '35px' },
    { field: 'color', header: 'פעילות', width: '55px' },
    { field: 'color', header: 'עובד', width: '100px' },
    { field: 'vin', header: 'רכב', width: '100px' },
    { field: 'year', header: 'נ.התקן', width: '50px' },
    { field: 'brand', header: 'סטטוס', width: '100px' },
    { field: 'color', header: 'חניון', width: '75px' },
    { field: 'color', header: 'תחנה', width: '75px' },
    { field: 'color', header: ' ', width: '15px' },
    { field: 'color', header: ' ', width: '15px' },
    { field: 'color', header: ' ', width: '15px' }

  ];
  @ViewChild(OvedNgComponent)
  ovdimNgPnuimDlg: OvedNgComponent;
  @ViewChild(RechevNgComponent)
  rechavimNgPnuimDlg: RechevNgComponent;
  @ViewChild(MidaNosafNgComponent)
  midaNodafNg: MidaNosafNgComponent;
  @ViewChild(ShinuiKavuaNgComponent)
  shinuiKavuaNg: ShinuiKavuaNgComponent;
  @ViewChild(HearatSidurComponent)
  hearatSidurComp: HearatSidurComponent;
  @ViewChild(MishtanaNgComponent)
  mishtanaNg: MishtanaNgComponent;
  
  selectedSidur: ITemplate;
  searchParams: SearchSidurParams;
  public pageSize = 9;
  public gridHeight: number = 360;
  public skip = 0;
  cols: any[];
  loading: boolean;
  isChodeshSagur: boolean = false;
  isYomSagur: boolean = false;
  displayDialogMessage: boolean = false;
  dialogAction: string = '';
  public currentPeilut: ITemplate = null;
  lstSidur: ITemplate[];
  totalRecords: number;
  public KodYechidaMevazaat: number;
  public taarichSidur: Date = this.userData.TaarichSidur;
  selectedRow: Number;
  setClickedRow: Function;
  SIDUR_AVODA_SGIRAT_IOM_ERROR_TITLE: string = " סגירת יום לא הצליחה נא שבץ את המשאבים המתאימים, סיים תחנה או חניון , והפוך משימות ללא פעילות";
  constructor(
    public datepipe: DatePipe,
    private changeDect: ChangeDetectorRef,
    protected activatedRoute: ActivatedRoute,
    private router: Router,
    private srv: SidurAvodaService,
    private nihulPremiaSrv: NihulPremiaService,
    private userData: UserDataService,
    private mesimaSrv: MesimaService,
    public dialogService: DialogService,
     private messageService: MessageService) {
      super(activatedRoute);
    this.searchParams = new SearchSidurParams();

    //this.searchParams.Ymim = this.taarichSidur.getDay() + 1;
    this.searchParams.Ymim = this.ConvertDayOfWeekToInt(this.taarichSidur)
    this.searchParams.dtSidur = this.taarichSidur;
    this.skip = 0;

    this.KodYechidaMevazaat = this.userData.KodYechidaMevatzat;

    this.setClickedRow = function (index) {
      this.selectedRow = index;
    }
  }
  SetChodeshSagur(dt: Date) {
    let year = dt.getFullYear();
    let month = dt.getMonth() + 1;
    this.nihulPremiaSrv.GetSgiratChodesh(year, month).subscribe(result => {
      this.isChodeshSagur = Number(result) > 0;
    });
  }
  ngOnInit() {
   super.ngOnInit();
    this.today = new Date().toISOString().split('T')[0];
    this.hi = {
      firstDayOfWeek: 0,
      dayNames: ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"],
      dayNamesShort: ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"],
      dayNamesMin: ["א", "ב", "ג", "ד", "ה", "ו", "ש"],
      monthNames: ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"],
      monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      today: 'היום',
      clear: 'נקה'

    };
    this.SetChodeshSagur(this.taarichSidur);
    //this.routeInterceptorService.getRouteOnNavigationEnd(route => {
    //      alert('hh');
    //  });
    this.cols = [
      { field: 'vin', header: 'פעיל', width: '5%' },
      { field: 'year', header: 'סדר', width: '3%' },
      { field: 'brand', header: 'איזור', width: '5%' },
      { field: 'color', header: 'פעילות', width: '5%' },
      { field: 'color', header: 'עובד', width: '5%' },
      { field: 'vin', header: 'רכב', width: '5%' },
      { field: 'year', header: 'נ.התקן', width: '3%' },
      { field: 'brand', header: 'סטטוס', width: '5%' },
      { field: 'color', header: 'חניון', width: '5%' },
      { field: 'color', header: 'תחנה', width: '5%' },
      { field: 'color', header: ' ', width: '5%' },
      { field: 'color', header: ' ', width: '5%' },
      { field: 'color', header: ' ', width: '5%' }
    ];
    $("p-paginator").wrap("<div class='ui-rtl' dir='ltr'></div>");
    this.loading = true;

  }
  selectCarWithButton(car: ITemplate) {
    this.selectedSidur = car;
  }
  OnSgiratYom() {
    this.nihulPremiaSrv.CheckAndUpdateSgiratYom(
      this.taarichSidur, this.searchParams.Ymim, this.userData.IdYechidaMevatzat,
      this.searchParams.id_yechida_mekabelet
    ).subscribe(check => {
      if (check == '') {
        this.messageService.add({ key: 'success', severity: 'success', life: 2000, detail: 'סגירת יום הצליחה.' });
      } else {
        this.lstSidur = check.Result.Data;
        this.totalRecords = check.Result.TotalPage;
        this.pageSize = 10000;
        setTimeout(() => { $("body .ui-table .ui-table-tbody>tr").css("background-color", "yellow"); }, 0);

        this.messageService.add({ key: 'success', severity: 'error', life: 4000, detail: this.SIDUR_AVODA_SGIRAT_IOM_ERROR_TITLE });
      }

    });

  }
  OnCreateMishtana() {
    //alert(this.router.url.replace('/',''));
    this.mishtanaNg.onOpenDialog();
  }
  OnShinuiKavua(peilut: ITemplate) {
    if (this.isChodeshSagur || this.isYomSagur)
      return;
    this.mesimaSrv.UpdateMesima(peilut.k_user, peilut.id_sug_peilut,
      peilut.id_mesima, peilut.id_peilot_lemesima,
      peilut.id_peilot_meshubetzet
    ).subscribe(result => {
      this.messageService.add({ key: 'success', severity: 'success', life: 2000, detail: 'המידע נשמר בהצלחה.' });
    },
      error => {
        this.messageService.add({ key: 'success', severity: 'error', life: 2000, detail: error.message });
      });
  }
  OnSaveMidaNosaf(data: MidaNosaf) {
    this.currentPeilut.kamut = data.Kamut;
    this.currentPeilut.sw_premia_letashlom = (data.HasPremia ? 1 : 0);
    this.currentPeilut.sw_male = (data.IsMale ? 1 : 0);
    this.OnUpdatePeilut('mida_nosaf', this.currentPeilut, null).subscribe(result => {
      this.messageService.add({ key: 'success', severity: 'success', life: 2000, detail: 'המידע נשמר בהצלחה.' });
    },
      error => {
        //this.messageService.add({ key: 'success', severity: 'error', life: 2000, detail: error.message });
      });
  }
  onShinuiKavuaClick(curRow: ITemplate) {
    this.shinuiKavuaNg.currentPeilut = curRow;
    this.currentPeilut = curRow;
    this.shinuiKavuaNg.showDialog();
  }
  onMidaNosafClick(curRow: ITemplate) {
    this.currentPeilut = curRow;
    if (this.isChodeshSagur || this.isYomSagur)
      return;
    const selectedData = curRow;


    this.midaNodafNg.midaNosafData = new MidaNosaf(this.taarichSidur,
      this.taarichSidur,
      (selectedData.sw_premia_letashlom == 1),
      (selectedData.sw_male == 1),
      selectedData.kamut);
    this.midaNodafNg.curSidur = selectedData;
    this.midaNodafNg.isSaveMessage=false;
    this.midaNodafNg.showDialog();
    console.log(selectedData);
  }

  private GetFilters(event: LazyLoadEvent): Filter[] {
    let filters: Filter[] = [];
    for (var filterKey in event.filters) {
      let filter: FilterMetadata = event.filters[filterKey];
      console.debug(`EntityComponent.loadEntities() - ${filterKey} - ${filter.matchMode} - ${filter.value}.`)

      filters.push(new Filter(filterKey, filter.value))
    }

    return filters;
  }
  ClickOved(data: any, dataItem) {
    if (this.isChodeshSagur || this.isYomSagur)
      return;

    this.currentPeilut = dataItem;
    this.ovdimNgPnuimDlg.onOpenDialog();
    this.ovdimNgPnuimDlg.SetModel(dataItem, this.searchParams.dtSidur, dataItem.k_user, this.searchParams.id_yechida_mevazaat,
      dataItem.id_sug_peilut, this.searchParams.Ymim, dataItem.sug_rechev_netzer);
  }
  ClickRechev(data: any, dataItem) {
    if (this.isChodeshSagur || this.isYomSagur)
      return;
    this.currentPeilut = dataItem;
    this.rechavimNgPnuimDlg.onOpenDialog();
    this.rechavimNgPnuimDlg.SetModel(dataItem, this.searchParams.dtSidur, dataItem.sug_rechev_netzer,
      dataItem.mispar_pnimi, this.searchParams.Ymim, dataItem.nefach_rehev == -1 ? null : dataItem.nefach_rehev,
      dataItem.yecholet_mahavr);
  }
  public GetRechev(dataItem: ITemplate): string {
    if (dataItem.mispar_pnimi == "" || dataItem.mispar_pnimi == null) return "שבץ";
    else return dataItem.mispar_pnimi;

  }
  public GetOvedName(dataItem: ITemplate): string {
    if (dataItem.full_name == "" || dataItem.full_name == null) return "שבץ";
    else return dataItem.full_name;

  }
  public SetColor(dataItem: any, type: string): SafeStyle {
    let styles = {
      'color': 'black'
    };
    let result;
    let statusMesima: any;
    let dt = dataItem as ITemplate;
    if (dt.id_status_mesima != 0) {
      statusMesima = dataItem.id_status_mesima;
    }
    let ovedName = dt.full_name;
    let sugMahutId = String(dt.id_sug_mahot_mesima) != "" ? String(dt.id_sug_mahot_mesima) : "-1";
    let misparRishui = dt.mispar_rishui_netzer;
    let isOvedMeshubatz = (ovedName != "" && ovedName != null) ? true : false;
    let isPeilutButza = statusMesima != ButzaStatus.LOButza;
    let isSiumHanyon = statusMesima == ButzaStatus.SiemBeHanuyon;
    let isRechevMeshubatz = (misparRishui != "" && misparRishui != null ? true : false && parseInt(sugMahutId) == Sug_Mahut.SUG_MAHUT_HAAVARA) || (parseInt(sugMahutId) != Sug_Mahut.SUG_MAHUT_HAAVARA);

    let peilutPoel: boolean;
    let isHavara: boolean;
    switch (parseInt(sugMahutId)) {
      case Sug_Mahut.SUG_MAHUT_HAAVARA:
        peilutPoel = false;
        isHavara = true;
        break;
      case Sug_Mahut.SUG_MAHUT_PINUI:
        peilutPoel = false;
        isHavara = false;
        break;
      default:
        peilutPoel = true;
        isHavara = true;
        break;
    }
    if (isPeilutButza) {
      if (isHavara) {
        if (type == 'oved' || type == 'rechev') {
          styles.color = 'blue';
        }
      }
      else {
        if (type == 'oved' || type == 'rechev' || (isSiumHanyon && type == 'status')) {
          styles.color = 'blue';
        }

      }
    }
    if (type == 'oved' && !isOvedMeshubatz) {
      styles.color = 'red';
    }
    else if (type == 'rechev' && !isRechevMeshubatz) {
      styles.color = 'red';
    }
    return styles;
    //return this.sanitizer.bypassSecurityTrustStyle(result);
  }
  SetOvedRechevVisibility(dataItem, type: string, ovedrechev: string) {
    let row = dataItem as ITemplate;
    let peilutPoel = false, isHavara = false;
    switch (row.id_sug_mahot_mesima) {
      case Sug_Mahut.SUG_MAHUT_HAAVARA:
        peilutPoel = false;
        isHavara = true;
        break;
      case Sug_Mahut.SUG_MAHUT_PINUI:
        peilutPoel = false;
        isHavara = false;
        break;
      default:
        peilutPoel = true;
        isHavara = true;
        break;
    }

    if (type == 'button' && dataItem.sw_pail == false) return false;

    if (ovedrechev == 'rechev') {
      if (!peilutPoel) return isHavara;
      else return !isHavara;
    }
    else if (ovedrechev == 'oved') {
      return isHavara;
    }
    else {
      if (type == 'text' || type == 'button')
        return row.id_sug_mahot_mesima != 2;
      else
        return row.id_sug_mahot_mesima == 2;
    }
  }

  onRowSelect(event, i) {
    if (i != null)
      this.selectedRow = i;

    this.currentPeilut = event as ITemplate;
    //this.SetOvedRechevVisibility
  }
  public OnBeforeUpdatePeilutRechev(sade: string, dataItem: ITemplate, event: any) {
   let oldValue=dataItem.mispar_pnimi;
    if (sade=='rechev'){
      dataItem.mispar_pnimi=event.target.value;
    }
    let RECHEV_BE_MOSACH = "שים לב, הרכב המבוקש במוסך/ לא ניתן לבחירה";
    let filters: Filter[] = [];

    if (sade=='rechev'){
      filters.push(new Filter("mispar_pnimi", dataItem.mispar_pnimi));

    }
    else 
    filters.push(new Filter("mispar_pnimi", event/*dataItem.mispar_pnimi*/));

    this.srv.getRechavimPnuim(this.searchParams.dtSidur, dataItem.sug_rechev_netzer,
      dataItem.mispar_pnimi_old, this.searchParams.Ymim,
      0, 500, filters,
      dataItem.nefach_rehev == -1 ? null : dataItem.nefach_rehev, null, null, '').
      subscribe(rechavim => {
        if (rechavim.Data.length > 0) {
          
          this.currentPeilut.mispar_pnimi = rechavim.Data[0].mispar_pnimi;
          this.currentPeilut.mispar_rishui_netzer = rechavim.Data[0].mispar_rishui_netzer;
          if (rechavim.Data[0].MesimotTemplate.trim() != "") {
            
            this.opendialogAndDoYes("שאלה", "שים לב,העובד כבר משובץ באופן קבוע למשימה: " + rechavim.Data[0].MesimotTemplate + " האם לשבץ ?", "290px")
            .subscribe((result) => {
              if (result == "yes") {
                this.OnUpdatePeilut('rechev', this.currentPeilut, null, true).subscribe(updated => {
                  this.RefreshData();
                });
              }
              else{
                this.currentPeilut.mispar_pnimi=dataItem.mispar_pnimi_old;
              }
            });
            

          }
          else if (rechavim.Data[0].IsRechevBetikun == 1) {
            dataItem.mispar_pnimi = dataItem.mispar_pnimi_old
            this.messageService.add({ key: 'success', severity: 'error', life: 4000, detail: RECHEV_BE_MOSACH });
          }
          else
            this.OnUpdatePeilut('rechev', this.currentPeilut, null).subscribe(result => {
              this.messageService.add({ key: 'success', severity: 'success', life: 2000, detail: 'המידע נשמר בהצלחה.' });
              this.RefreshData();
            },
              error => {
                //this.messageService.add({ key: 'success', severity: 'error', life: 2000, detail: error.message });
                this.RefreshData();
              });
        }
        else {
          this.messageService.add({ key: 'success', severity: 'error', life: 2000, detail: 'שים לב,הרכב המבוקש לא קיים/לא מתאים למשימה' });
          this.RefreshData();
          //event.target.value=oldValue;
        }


        //rechavim.Data[0]
        //alert(rechavim.Data.mispar_pnimi);
        //this.filteredItems = rechavim.Data;
        //this.init();
      });
  }
  OnChangePail(is_pail: boolean, dataItem: ITemplate, event: any) {
    if (!dataItem.sw_pail) {
      this.opendialogAndDoYes("שאלה",  "האם בטוח לבטל פעילות", "290px")
      .subscribe((result) => {
        if (result == "yes") {
          this.currentPeilut.sw_pail = 0;
          this.OnUpdatePeilut('pail', this.currentPeilut, null, true).subscribe(updated => {
            this.RefreshData();
          });
        }
        else{
          this.currentPeilut.sw_pail = 1;
        }
      });
    
    }
    else {
      dataItem.sw_pail = is_pail ? 1 : 0;
      this.OnUpdatePeilut('pail', dataItem, event).subscribe(result => {
        this.messageService.add({ key: 'success', severity: 'success', life: 2000, detail: 'המידע נשמר בהצלחה.' });
      },
        error => {
          //this.messageService.add({ key: 'success', severity: 'error', life: 2000, detail: error.message });
        });
      this.RefreshData();
    }
  }
  OnHazeg() {

    this.RefreshData();
  }
  OnUpdatePeilutWrap(sade: string, dataItem: ITemplate, event: any) {
    this.OnUpdatePeilut(sade, dataItem, event, false).subscribe(result => {
      this.RefreshData();
    });
  }
  OnUpdatePeilut(sade: string, dataItem: ITemplate, event: any, ishodaa: boolean = false): Observable<any> {
  if (sade=='seder_peula') dataItem.seder_peula=event;
    return Observable.create(observer => {


      this.srv.updatesiduravoda(dataItem, sade,
        this.searchParams.dtSidur, this.searchParams.id_yechida_mevazaat).
        subscribe(rows => {
          observer.next(1);
          if (ishodaa)
            this.messageService.add({ key: 'success', severity: 'success', life: 2000, detail: 'שמירה בוצע בהצלחה' });
        },
          error => {
            this.RefreshData();
            //if (ishodaa)
//              this.messageService.add({ key: 'success', severity: 'error', life: 2000, detail: error.message });
            observer.error(new Error(error.message));
            //observer.next(0);
          }
        );



    });

  }
  OnCloseMishtana(row: ITemplate) {
    this.srv.UpdateSiduravodaMishtana(this.userData.IdYechidaMevatzat, this.userData.TaarichSidur, row.id_mesima).
      subscribe(row => {
        this.RefreshData();
        this.messageService.add({ key: 'success', severity: 'success', life: 2000, detail: 'שמירה בוצע בהצלחה' });

        /*  this.toastr.success(
            '<center>שמירה בוצע בהצלחה</center>', 'הצלחה',
            {
              timeOut: 5000,
              enableHtml: true,
              closeButton: true,
              positionClass: 'toast-top-center'
            });*/
      },
        error => this.messageService.add({ key: 'success', severity: 'error', life: 2000, detail: error.message })
      );
    //alert(row.id_mesima);
  }
  OnChangeStatus(temp: ITemplate) {
    this.currentPeilut = temp;

    this.OnUpdatePeilut('status', this.currentPeilut, null).subscribe(result => {
      this.RefreshData();
      this.messageService.add({ key: 'success', severity: 'success', life: 2000, detail: 'שמירה בוצע בהצלחה' });
    }, error => {
      //this.messageService.add({ key: 'success', severity: 'error', life: 2000, detail: error.message });
    });
  }
  OnDialogYesClick() {

    switch (this.dialogAction) {
      case 'pail':
        this.currentPeilut.sw_pail = 0;
        this.OnUpdatePeilut('pail', this.currentPeilut, null, true).subscribe(updated => {
          this.RefreshData();
        });
      case 'oved':
        this.OnUpdatePeilut('oved', this.currentPeilut, null, true).subscribe(updated => {
          this.RefreshData();
        });
        break;
      case 'rechev':
        this.OnUpdatePeilut('rechev', this.currentPeilut, null, true).subscribe(updated => {
          this.RefreshData();
        });
        break;
    }
    this.displayDialogMessage = false;
  }
  OnDialogNoClick() {
    switch (this.dialogAction) {
      case 'pail':
        this.currentPeilut.sw_pail = 1;
        break;
    }
    this.displayDialogMessage = false;
  }
  OnCloseOved(row: any) {
    const oldPeilut = Object.assign({}, this.currentPeilut);
    if (row != 'empty') {
      let oved = row as IOvedPanui;
      this.currentPeilut.full_name = oved.full_name;
      this.currentPeilut.k_user = oved.k_user;
      if (row.MesimotTemplate.trim() != "") {

        this.opendialogAndDoYes("שאלה", "שים לב,העובד כבר משובץ באופן קבוע למשימה: " + oved.MesimotTemplate + " האם לשבץ ?", "490px")
        .subscribe((result) => {
          if (result == "yes") {
            this.OnUpdatePeilut('oved', this.currentPeilut, null, true).subscribe(updated => {
              this.RefreshData();
            });
          }
          else{
            this.currentPeilut.full_name = oldPeilut.full_name;
            this.currentPeilut.k_user = oldPeilut.k_user;
          }
        });        
       
      }
      else {
        this.OnUpdatePeilut('oved', this.currentPeilut, null).subscribe(result => {
          this.messageService.add({ key: 'success', severity: 'success', life: 2000, detail: 'המידע נשמר בהצלחה.' });
        },
          error => {
            //this.messageService.add({ key: 'success', severity: 'error', life: 2000, detail: error.message });
          });
        this.RefreshData();
      }
    }

  }
  public opendialogAndDoYes(title: string, question: string, height: string): Observable<any> {

    const dialogRef = this.dialogService.open(YesNoDialogComponent, {
      header: 'שאלה',
      width: '450px',
      height: height,
      baseZIndex:1,
      //autoZIndex: true,
      data: {
        question:question,
        title: title
      },
      rtl: true
    });

    return dialogRef.onClose;

  }
  OnCloseRechev(row: IRechevPanui) {
    const oldPeilut = Object.assign({}, this.currentPeilut);
    
    if (row != 'empty') {
      this.currentPeilut.mispar_pnimi = row.mispar_pnimi;
      this.currentPeilut.mispar_rishui_netzer = row.mispar_rishui_netzer;
      if (row.MesimotTemplate.trim() != "") {
        this.opendialogAndDoYes("שאלה", "שים לב,העובד כבר משובץ באופן קבוע למשימה: " + row.MesimotTemplate + " האם לשבץ ?", "290px")
          .subscribe((result) => {
            if (result == "yes") {
              this.OnUpdatePeilut('rechev', this.currentPeilut, null, true).subscribe(updated => {
                this.RefreshData();
              });
            }
            else{
              this.currentPeilut.mispar_pnimi=oldPeilut.mispar_pnimi;
              this.currentPeilut.mispar_rishui_netzer=oldPeilut.mispar_rishui_netzer;
            }
          });


      }
      else {
        this.OnUpdatePeilut('rechev', this.currentPeilut, null).subscribe(result => {
          this.messageService.add({ key: 'success', severity: 'success', life: 2000, detail: 'המידע נשמר בהצלחה.' });
          this.RefreshData();
        },
          error => {
            this.messageService.add({ key: 'success', severity: 'error', life: 2000, detail: error.message });
            this.RefreshData();
          });

      }
    }

  }
  RefreshData(isYechidaChanged?: boolean) {
    this.pageSize = 9;
    setTimeout(() => this.loading = true, 0);
    this.srv.getallsiduravoda(isYechidaChanged ? true : false,
      this.taarichSidur, this.searchParams.Ymim, this.userData.IdYechidaMevatzat,
      this.searchParams.id_yechida_mekabelet, this.skip, this.pageSize, this.router.url.replace('/','')
    ).subscribe(sidur => {
      this.lstSidur = sidur.Data;
      this.totalRecords = sidur.TotalPage;
      this.isYomSagur = sidur.IsYomSagur;
      if (isYechidaChanged) {
        this.HearatSidur = sidur.SidurData.hearat_sidur;

      }
      $("p-paginator").wrap("<div class='ui-rtl' dir='ltr'></div>");

      setTimeout(() => this.loading = false, 0);

    });
  }

  public OnOpenHearatSidur() {
    this.hearatSidurComp.HearatSidur = this.HearatSidur;
    this.hearatSidurComp.showDialog();
  }
  public OnHearatSidurSave(heara: string) {
    this.srv.InsertUpdateHearatSidur(this.taarichSidur, this.searchParams.id_yechida_mevazaat, encodeURI(heara)).subscribe(() => {
      this.messageService.add({ key: 'success', severity: 'success', life: 2000, detail: 'המידע נשמר בהצלחה.' });
      this.RefreshData(true);

    }, error => {
      this.messageService.add({ key: 'success', severity: 'error', life: 2000, detail: error.message });


    });
  }
  public OnPrevDateClick() {
    this.taarichSidur = new Date(moment(this.taarichSidur).add(-1, 'day').format("MM/DD/YYYY"));
    this.RefreshData(true);
  }
  public OnNextDateClick() {
    this.taarichSidur = new Date(moment(this.taarichSidur).add(1, 'day').format("MM/DD/YYYY"));
    this.RefreshData(true);
  }
  public dtChange(value: Date) {
    // Update the JSON birthDate string date
    //if (value) {
    //this.skip = 0;
    this.searchParams.Ymim = this.ConvertDayOfWeekToInt(this.taarichSidur);//.getDay() + 1;
    this.searchParams.dtSidur = this.taarichSidur;
    this.userData.TaarichSidur = this.taarichSidur;
    this.SetChodeshSagur(this.taarichSidur);
    //this.model.birthDate = this.intl.formatDate(value, 'yyyy-MM-dd');
    this.RefreshData();
    //}

  }
  OnYechidaMevazaatChanged(data: any) {

    let row = data.yechidaData as IYechidaIrgunit;
    this.skip = 0;
    this.searchParams.kod_yechida_mevazaat = row.kod_yechida;
    this.userData.KodYechidaMevatzat = Number(row.kod_yechida);
    this.userData.IdYechidaMevatzat = row.id_yechida;
    this.searchParams.id_yechida_mevazaat = row.id_yechida;
    this.RefreshData(true);
  }
  OnYechidaMekabeletChanged(data: any) {
    let row = data.yechidaData as IYechidaIrgunit;
    this.skip = 0;
    this.searchParams.kod_yechida_mekabelet = row ? row.kod_yechida : null;
    this.searchParams.id_yechida_mekabelet = row ? row.id_yechida : null;
    this.RefreshData();
  }
  OnCloseYechidaMevazaat(row: IYechidaIrgunit) {

    if (row != 'empty') {
      this.userData.KodYechidaMevatzat = Number(row.kod_yechida);
      this.userData.IdYechidaMevatzat = row.id_yechida;
      this.searchParams.kod_yechida_mevazaat = row.kod_yechida;
      this.searchParams.id_yechida_mevazaat = row.id_yechida;
      this.RefreshData();
    }

  }
  OnCloseYechidaMekabelet(row: IYechidaIrgunit) {

    if (row != 'empty') {
      this.searchParams.kod_yechida_mekabelet = row ? row.kod_yechida : null;
      this.searchParams.id_yechida_mekabelet = row ? row.id_yechida : null;
      this.RefreshData();
    }

  }
  loadSidurLazy(event: LazyLoadEvent) {
    let filters: Filter[] = this.GetFilters(event);

    setTimeout(() => this.loading = true, 0);


    this.searchParams.id_yechida_mevazaat = this.userData.IdYechidaMevatzat;

    this.skip = event.first;
    this.searchParams.Ymim = this.ConvertDayOfWeekToInt(this.taarichSidur);

    this.srv.getallsiduravoda(false,
      this.taarichSidur, this.searchParams.Ymim, this.searchParams.id_yechida_mevazaat, this.searchParams.id_yechida_mekabelet, this.skip, this.pageSize,
      this.router.url.replace('/','')
      //  dtSidur, Ymim, idYechidaMevazaat, idYechidaMekabelet, skip, take
    ).subscribe(sidur => {

      this.lstSidur = sidur.Data;
      this.totalRecords = sidur.TotalPage;
      $("p-paginator").wrap("<div class='ui-rtl' dir='ltr'></div>");
      setTimeout(() => this.loading = false, 0);

    },
      error => console.log(error),
    );
  }



}
