import { Component, OnInit, ViewChild, HostBinding } from '@angular/core';
import { UserDataService } from 'src/app/shared/services/user-data.service';
import { State } from '@progress/kendo-data-query';
import { TikuneiRechevRemoteDataService } from './tikunei-rechev-remote-data.service';
import { DialogService, MessageService } from 'primeng/api';

import { Observable } from 'rxjs/Observable';
import { TvrTikunRechev, TikuneiRechevService, TikunRechevDetails, IRechevPanui, DayOfWeek, Yamim, IOvedPanui, Filter } from '../..';
import { TikunRechevComponent } from './tikun-rechev.component';
import { ActivatedRoute } from '@angular/router';
import { RechevNgComponent, OvedNgComponent } from '../../components';
import { BasePageSidurComponent } from '../base-page-sidur/base-page-sidur-component';
import { RechevService } from '../../shared/services/rechev.service';



@Component({
  selector: 'app-tikunei-rechev',
  templateUrl: './tikunei-rechev.component.html',
  styleUrls: ['./tikunei-rechev.component.scss']
})
export class TikuneiRechevComponent extends BasePageSidurComponent implements OnInit  {
  mispar_rishui_netzer:string;
  mispar_pnimi:string;
  mispar_pnimi_old:string;
  k_user?:number;
  nahag_full_name:string="";
  @ViewChild(OvedNgComponent)
  nehagDlg: OvedNgComponent;
  @ViewChild(RechevNgComponent)
  rechavimNgPnuimDlg: RechevNgComponent;
  dtDate: Date;

  public statuses: Array<{ text: string, value: number }> = [
    { text: "", value: null },
    { text: "בתיקון", value: 0 },
    { text: "חזר מתיקון", value: 1 }
  ];

  public status: { text: string, value: number } = { text: "בתיקון", value: 0 };
  public gridState: State = {

    sort: [],
    skip: 0,
    take: 7
  };
  constructor(
    public dialogService: DialogService,
    private userDataService: UserDataService,
    private tikunsrv: TikuneiRechevService,
    private rechevSrv:RechevService,
    private remoteSrv: TikuneiRechevRemoteDataService,
    private messageService: MessageService,
    protected activatedRoute:ActivatedRoute
  ) {
    super(activatedRoute);
    
    this.dtDate = this.userDataService.Today;
    this.remoteSrv.meTaarich = this.userDataService.Today;
  }
  OnCloseRechev(row: IRechevPanui) {

    this.mispar_rishui_netzer=row.mispar_rishui_netzer;
    this.mispar_pnimi=row.mispar_pnimi;
  }
  
  ClickOved(event: MouseEvent) {
    this.nehagDlg.onOpenDialog();
    this.nehagDlg.SetModel("empty",this.dtDate, null, null,
      null, null, null);
  }
  ClickRechev() {
    this.rechavimNgPnuimDlg.onOpenDialog();
    this.rechavimNgPnuimDlg.SetModel("empty", this.dtDate, null,"", this.ConvertDayOfWeekToInt(this.dtDate),
     null,
      -1);
  }
  OnCloseNehag(row: IOvedPanui) {
    this.nahag_full_name=row.full_name;
    this.k_user=  row.k_user;
  }
  ngOnInit() {
    super.ngOnInit();
    this.remoteSrv.isFixed=this.status.value;

       

  }
  OnHazeg(){
    this.remoteSrv.isFixed=this.status.value;
    this.remoteSrv.refresh();
    
  }
  onBlurDate() {

  }
  public opendialog(dataItem: any): Observable<any> {
    const dialogRef = this.dialogService.open(TikunRechevComponent, {
      header: 'שאלה',
      width: '900px',
      height: '700px',
      data: {
        dataItem: dataItem
      },
      autoZIndex: true,
      rtl: true
    });
    return dialogRef.onClose;

  }

  public addHandler({ sender }) {
    let rechevDetails: TikunRechevDetails=new TikunRechevDetails();
    this.opendialog(rechevDetails).subscribe((tikunRechev: TvrTikunRechev) => {
      this.tikunsrv.InsertTikuneiRechev(tikunRechev).subscribe((result) => {
        this.messageService.add({ key: 'success', severity: 'success', life: 2000, detail: 'המידע נשמר בהצלחה.' });
      },resultError => {
        if (resultError.status!=412)
          this.messageService.add({ key: 'success', severity: 'error', life: 2000, detail: resultError});
      });

    });

  }

  public editHandler({ sender, rowIndex, dataItem }) {
    
    this.opendialog(dataItem).subscribe((tikunRechev: TvrTikunRechev) => {
      if (tikunRechev) {
        this.tikunsrv.UpdateTikuneiRechev(tikunRechev).subscribe((result) => {

          this.messageService.add({ key: 'success', severity: 'success', life: 2000, detail: 'המידע נשמר בהצלחה.' });
        },
          error => {
            this.messageService.add({ key: 'success', severity: 'error', life: 2000, detail: error.message });
          }
        );
      }
    });


  }
    ChangeMisparPnimi() {
      let filters: Filter[] = [];
    let RECHEV_LO_NITAN_LE_BCHIRA = "שים לב, הרכב המבוקש  לא ניתן לבחירה";

    let parentThis = this;
    if (this.mispar_pnimi.trim() == '') {
      this.mispar_rishui_netzer='';
      return;
    }
    filters.push(new Filter("mispar_pnimi", this.mispar_pnimi));
      this.rechevSrv.GetRechavimPeilim(0, 1000,filters,null,null).
      subscribe(rechev => {
        if (rechev.TotalPage==1) {
          parentThis.mispar_pnimi_old = rechev.Data[0].mispar_pnimi;
          parentThis.mispar_rishui_netzer=rechev.Data[0].mispar_rishui_netzer;
        }
        else {
          this.messageService.add({ key: 'success', severity: 'error', life: 4000, detail: 'הרכב שבחרת לא נמצא' });
          parentThis.mispar_pnimi=parentThis.mispar_pnimi_old;

        }
      });

  }


}
