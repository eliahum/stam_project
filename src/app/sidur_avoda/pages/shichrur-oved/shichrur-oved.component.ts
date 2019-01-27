import { Component, OnInit, ViewChild, HostBinding } from '@angular/core';
import { ShichrurRemoteDataService } from './shichrur-remote-data.service';
import { IYechidaIrgunit, OvedService, ShichrurOved, IOvedPanui, DayOfWeek, Yamim, UserService, SidurAvodaService } from '../..';
import { IPirteiOved } from '../../shared/types/pirtei_oved';
import { State } from '@progress/kendo-data-query';
import { UserDataService } from 'src/app/shared/services/user-data.service';
import * as moment from 'moment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OvedNgComponent, YesNoDialogComponent } from '../../components';
import { GridComponent, GridDataResult } from '@progress/kendo-angular-grid';
import { IntlService } from '@progress/kendo-angular-intl';
import { ShichrurOvdimService } from '../../shared/services/shichrur-ovdim.service';
import { MessageService, DialogService } from 'primeng/api';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import { forkJoin } from "rxjs/observable/forkJoin";
import { ActivatedRoute } from '@angular/router';
import { AutoCompleteComponent } from '@progress/kendo-angular-dropdowns';
import { BasePageSidurComponent } from '../base-page-sidur/base-page-sidur-component';



@Component({
  selector: 'app-shichrur-oved',
  templateUrl: './shichrur-oved.component.html',
  styleUrls: ['./shichrur-oved.component.scss']
})
export class ShichrurOvedComponent extends BasePageSidurComponent implements OnInit {

  public KodYechidaMevazaat: number;
  public IdYechidaMevatzat: number;

  public view: Observable<GridDataResult>;
  public lstOvdim: Array<IPirteiOved> = [];
  public shichrurForm: FormGroup;
  shichrur: ShichrurOved = new ShichrurOved();
  KodYechida?: number;
  ovedName?: string;
  public dtMeDate: Date = new Date(moment(this.userData.TaarichSidur).add(0, 'day').format("MM/DD/YYYY"));//this.userData.TaarichSidur;
  public dtAdDate: Date = new Date(moment(this.userData.TaarichSidur).add(7, 'day').format("MM/DD/YYYY"));
  private editedRowIndex: number;
  public currentZmanHatchala: Date = null;
  public currentZmanSof: Date = null;
  todayDate: Date;
  SHIHRUR_RANGE: number = 30;


  OVED_SHIHRUR_OVED_DATE_TIME_HAFIFA: string = " לא ניתן לשחרר עובד במועד שחרור חופף בתאריכים : XXX - YYY";
  OVED_SHIHRUR_OVED_MESUBATZ_ERROR: string = " לא ניתן לשחרר עובד המשובץ במשימות : ";
  NIUD_DELETE_CONFIRM = "האם למחוק ניוד עובד ?";

  public gridState: State = {

    sort: [],
    skip: 0,
    take: 7
  };

  @ViewChild(OvedNgComponent)
  ovdimNgPnuimDlg: OvedNgComponent;

  @ViewChild("listOvdimPanel") 
  listOvdimPanel:AutoCompleteComponent;


  //kod_yechidaControl: FormControl;

  constructor(private remoteSrv: ShichrurRemoteDataService,
    private sidurAvodaService: SidurAvodaService,
    private userData: UserDataService,
    private ovedSrv: OvedService,
    private intl: IntlService,
    private formBuilder: FormBuilder,
    private shichrurSrv: ShichrurOvdimService,
    private messageService: MessageService,
    private userService: UserService,
    public dialogService: DialogService,
    protected activatedRoute: ActivatedRoute
  ) {
    super(activatedRoute);
    //this.createFormGroup = this.createFormGroup.bind(this);
    this.remoteSrv.dtMeDate = this.dtMeDate;
    this.remoteSrv.dtAdDate = this.dtAdDate;
    this.shichrur.zman_hatchala = this.dtMeDate;
    this.shichrur.zman_sof = this.dtAdDate;
    this.KodYechidaMevazaat = this.userData.KodYechidaMevatzat;
    this.IdYechidaMevatzat = this.userData.IdYechidaMevatzat;

  }
  public createFormGroup(args: any): FormGroup {

    const item = (args.isNew ? this.shichrur : args.dataItem) as ShichrurOved;
    if (args.isNew) {
      this.currentZmanHatchala = (this.dtMeDate);
      this.currentZmanSof = (this.dtMeDate);

    }
    else {
      this.currentZmanHatchala = (new Date(item.zman_hatchala));
      this.currentZmanSof = (new Date(item.zman_sof));
    }
    this.shichrur.zman_hatchala = this.currentZmanHatchala;
    this.shichrur.zman_sof = this.currentZmanSof;


    this.shichrurForm = this.formBuilder.group({
      "id": [item.id],
      "kod_yechida": [item.kod_yechida, [Validators.required]],
      "id_yechida": [item.id_yechida, [Validators.required]],
      "td_zehut_user": [item.td_zehut_user, [Validators.required]],
      "full_name": [item.full_name, [Validators.required]],
      "zman_hatchala": [this.currentZmanHatchala, [Validators.required]],
      "zman_sof": [this.currentZmanSof, [Validators.required]],
      "t_tafkid": [item.t_tafkid, [Validators.required]],
      "heara": [item.heara],
      "k_user": [item.k_user, [Validators.required]]
    });


    if (args.isNew) {
      this.shichrurForm.controls.zman_hatchala.setValue(this.dtMeDate);
      this.shichrurForm.controls.zman_sof.setValue(this.dtMeDate);
    }
    else {
      this.shichrurForm.controls.zman_hatchala.setValue((new Date(item.zman_hatchala)));
      this.shichrurForm.controls.zman_sof.setValue((new Date(item.zman_sof)));
    }

    return this.shichrurForm;
  }
  createForm(): any {

    this.shichrurForm = this.formBuilder.group({
      "id": [this.shichrur.id],
      "kod_yechida": [this.shichrur.kod_yechida, [Validators.required]],
      "id_yechida": [this.shichrur.id_yechida, [Validators.required]],
      "td_zehut_user": [this.shichrur.td_zehut_user, [Validators.required]],
      "full_name": [this.shichrur.full_name, [Validators.required]],
      "zman_hatchala": [this.shichrur.zman_hatchala, [Validators.required]],
      "zman_sof": [this.shichrur.zman_sof, [Validators.required]],
      "t_tafkid": [this.shichrur.t_tafkid, [Validators.required]],
      "heara": [this.shichrur.heara],
      "k_user": [this.shichrur.k_user, [Validators.required]]
    });

    this.shichrurForm.controls.zman_hatchala.setValue(this.dtMeDate);
    this.shichrurForm.controls.zman_sof.setValue(this.dtAdDate);
  }
  // public editHandler({ sender, rowIndex, dataItem }) {

  //   // this.shichrurForm = this.formBuilder.group({
  //   //   "kod_yechida": [this.shichrur.kod_yechida, [Validators.required]],
  //   //   "id_yechida": [this.shichrur.id_yechida, [Validators.required]],
  //   //   "td_zehut_user": [this.shichrur.td_zehut_user, [Validators.required]],
  //   //   "full_name": [this.shichrur.full_name, [Validators.required]],
  //   //   "zman_hatchala": [this.shichrur.zman_hatchala, [Validators.required]],
  //   //   "zman_sof": [this.shichrur.zman_sof, [Validators.required]],
  //   //   "t_tafkid": [this.shichrur.t_tafkid, [Validators.required]],
  //   //   "heara": [this.shichrur.heara],
  //   //   "k_user": [this.shichrur.k_user, [Validators.required]]
  //   // });


  //   this.editedRowIndex = rowIndex;
  //   sender.editRow(rowIndex, this.shichrurForm);
  // }
  
  

  ClickOved(event: MouseEvent, dataItem: ShichrurOved) {

    this.ovdimNgPnuimDlg.onOpenDialog();
    this.ovdimNgPnuimDlg.SetModel(dataItem, this.userData.TaarichSidur,
      dataItem.k_user, dataItem.id_yechida,
      null,
      this.ConvertDayOfWeekToInt(this.userData.TaarichSidur), null);
  }

  ngOnInit() {
 super.ngOnInit();
    this.userService.GetUserData().subscribe(prms => {
      this.todayDate = moment(prms.ToDay).toDate();
    });
 


    this.currentZmanHatchala = new Date(2014, 1, 1);
    this.createForm();

  }
  OnCloseYechidaMevazaat(row: IYechidaIrgunit) {
    if (row != 'empty') {
      {
        this.shichrurForm.controls.kod_yechida.setValue(row.kod_yechida)
        this.shichrurForm.controls.id_yechida.setValue(row.id_yechida)
      }
    }
  }

  private closeEditor(grid, rowIndex = this.editedRowIndex) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    //this.shichrurForm = undefined;
  }
  public cancelHandler({ sender, rowIndex }) {
    this.closeEditor(sender, rowIndex);
  }
  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);

    this.shichrurForm = this.createFormGroup({ isNew: false, dataItem: dataItem })

    this.editedRowIndex = rowIndex;

    sender.editRow(rowIndex, this.shichrurForm);
  }
  public OnHazeg() {
    this.remoteSrv.refresh();
  }
  public removeHandler({ dataItem }) {
    let shichrurData = dataItem as ShichrurOved;



    this.opendialogAndDoYes("שאלה", this.NIUD_DELETE_CONFIRM, "220px")
      .subscribe((result) => {
        if (result == "yes") {
          shichrurData.deleted = 1;
          shichrurData.heara = null;
          this.shichrurSrv.UpdateShichrurOved(shichrurData).subscribe(() => {
            this.messageService.add({ key: 'success', severity: 'success', life: 2000, detail: 'שמירה בוצע בהצלחה.' });
            this.remoteSrv.refresh();
          });

        }
      });

  }


  public addHandler({ sender }) {
    
    this.closeEditor(sender);

    sender.addRow(this.createFormGroup({ isNew: true }));
  }

  public requestDataFromMultipleSources(shichrurData: any): Observable<any[]> {
    let response1 = this.shichrurSrv.IsShichrurValid(shichrurData);
    let response2 = this.shichrurSrv.CheckIfOvedMeshubatz(shichrurData);
    return forkJoin([response1, response2]);
  }
  public opendialogAndDoYes(title: string, question: string, height: string): Observable<any> {
    const dialogRef = this.dialogService.open(YesNoDialogComponent, {
      header: 'שאלה',
      width: '200px',
      height: height,
      data: {
        question: question,
        title: title
      },
      rtl: true
    });

    return dialogRef.onClose;

  }
  public OnLechabetzBkolZotDialog(shichrurData: any, isNew: boolean,
    text_result: string, sender: any, rowIndex: number) {
    let arr = text_result.split(',');
    let mystr = "";
    arr.forEach(row => {
      let mesima = row.split(':')[0];
      let taarich = row.split(':')[1];
      if (taarich && mesima)
        mystr += "<br>" + mesima + " בתאריך : " + taarich;
    });
    this.opendialogAndDoYes("שאלה", "<b>" + this.OVED_SHIHRUR_OVED_MESUBATZ_ERROR + "</b><br>" + mystr + "<br>האם בכל זאת לשחרר ?",
      "250px")
      .subscribe((result) => {
        if (result == "yes") {
          this.Shabetz(shichrurData, isNew).subscribe(() => sender.closeRow(rowIndex));
        }
      });

  }
  Shabetz(shichrurData: any, isNew: boolean): Observable<any> {
    return Observable.create(observer => {
      if (isNew) {
        this.shichrurSrv.InsertShichrurOved(shichrurData).subscribe(() => {
          this.messageService.add({ key: 'success', severity: 'success', life: 2000, detail: 'שמירה בוצע בהצלחה.' });
          this.remoteSrv.refresh();
          observer.next(1);
        });
      }
      else {
        this.shichrurSrv.UpdateShichrurOved(shichrurData).subscribe(() => {
          this.messageService.add({ key: 'success', severity: 'success', life: 2000, detail: 'שמירה בוצע בהצלחה.' });
          this.remoteSrv.refresh();
          observer.next(2);
        });

      }
    });
  }
  public saveHandler({ sender, rowIndex, formGroup, isNew }) {

    const obj: ShichrurOved = formGroup.value;

    let shichrurData = {
      "id": (obj.id ? obj.id.toString() : "-1"),
      "zman_hatchala": this.intl.formatDate(this.currentZmanHatchala, 'yyyy-MM-dd'),
      "zman_sof": this.intl.formatDate(this.currentZmanSof, 'yyyy-MM-dd'),
      "k_user": obj.k_user.toString(),
      "heara": (obj.heara ? obj.heara.toString() : ""),
      "deleted": "0"
    };

    let parentThis = this;
    let start = moment(this.currentZmanHatchala);
    let now = moment(this.todayDate);


    //let duration = moment.duration(now.diff(start));
    let days = now.diff(start, 'days');

    if (days > this.SHIHRUR_RANGE) {
      this.messageService.add({
        key: 'success', severity: 'error', life: 4000,
        detail: ` טווח התאריכים אינו יכול להיות גדול  מ ${this.SHIHRUR_RANGE} יום.`
      });
      return;
    }
    this.requestDataFromMultipleSources(shichrurData).subscribe(responseList => {
      let shichrurResult = responseList[0];
      let ovedMeshubatzResult = responseList[1];

      if (shichrurResult == '' && ovedMeshubatzResult == '') {
        this.Shabetz(shichrurData, isNew).subscribe(() => { });
        sender.closeRow(rowIndex);
      }
      else if (shichrurResult != '') {


        this.messageService.add({
          key: 'success', severity: 'error', life: 4000,
          detail: parentThis.OVED_SHIHRUR_OVED_DATE_TIME_HAFIFA.replace("XXX", shichrurResult.split(',')[0]).replace("YYY", shichrurResult.split(',')[1])
        });
      }
      else if (ovedMeshubatzResult != '') {

        this.OnLechabetzBkolZotDialog(shichrurData, isNew, ovedMeshubatzResult, sender, rowIndex)


      }
    });



    //sender.editRow(0, this.shichrurForm);


  }

  OnCloseOved(row: any) {
    if (row == "empty") return;
    let oved = row as IOvedPanui;
    this.shichrurForm.controls.full_name.setValue(oved.full_name);
    this.shichrurForm.controls.full_name.markAsDirty();
    this.ovedSrv.GetOvedById(oved.k_user).subscribe((data) => {
      this.shichrurForm.controls.t_tafkid.setValue((data as IPirteiOved).t_tafkid);
      this.shichrurForm.controls.k_user.setValue(oved.k_user);
      this.shichrurForm.controls.k_user.markAsDirty();
    });
    this.shichrurForm.controls.td_zehut_user.setValue(oved.td_zehut_user);
    this.shichrurForm.controls.zman_hatchala.setValue(this.userData.TaarichSidur);
    this.shichrurForm.controls.zman_sof.setValue(this.userData.TaarichSidur);

    this.shichrurForm.controls.zman_hatchala.markAsDirty();
    this.shichrurForm.controls.zman_sof.markAsDirty();
    this.shichrurForm.controls.td_zehut_user.markAsDirty();
    this.shichrurForm.controls.t_tafkid.markAsDirty();
    this.shichrurForm.controls.heara.markAsDirty();
  }
  public dtHatchalaChange(value: Date) {
    this.shichrurForm.controls.zman_hatchala.setValue(value);
    this.shichrur.zman_hatchala = value;
  }
  public dtSofChange(value: Date) {
    this.shichrurForm.controls.zman_sof.setValue(value);
    this.shichrur.zman_sof = value;
  }
  OnYechidaGridChanged({ yechidaData, parentrow, action }) {
    
    if (action != 'init') {
      if (yechidaData != null) {
        let data = (yechidaData as IYechidaIrgunit);
        parentrow.id_yechida = data.id_yechida;

        this.shichrurForm.controls.kod_yechida.setValue(data.kod_yechida)
        this.shichrurForm.controls.kod_yechida.markAsDirty();
        this.shichrurForm.controls.id_yechida.setValue(data.id_yechida)
        this.shichrurForm.controls.id_yechida.markAsDirty()
      }
      this.shichrurForm.controls.k_user.setValue(null);
      this.shichrurForm.controls.t_tafkid.setValue(null);
      this.shichrurForm.controls.full_name.setValue(null);
      this.shichrurForm.controls.heara.setValue(null);
      this.shichrurForm.controls.td_zehut_user.setValue(null);
    }
  }
  public onBlurMeDate() {
    this.remoteSrv.dtMeDate = this.dtMeDate;
    this.remoteSrv.refresh();

  }

  public dtMeChange(value: Date) {
    this.remoteSrv.dtMeDate = value;
    this.shichrur.zman_hatchala = value;

    this.remoteSrv.refresh();
  }
  public dtAdChange(value: Date) {
    this.remoteSrv.dtAdDate = value;
    this.shichrur.zman_sof = this.currentZmanSof;

    this.remoteSrv.refresh();
  }
  OnYechidaKvuaChanged({ yechidaData }) {
    let row = yechidaData as IYechidaIrgunit;
    this.IdYechidaMevatzat= row.id_yechida;
    this.listOvdimPanel.text="";
    this.listOvdimPanel.value=null;
    this.remoteSrv.OvedId=null;
    this.remoteSrv.yechidaKvuaID = row.id_yechida;
    // /this.full_name="";
    this.remoteSrv.refresh();
  }
  OnCloseYechidaKvua(row: IYechidaIrgunit) {

    if (row != 'empty') {
      //this.remoteSrv.yechidaKvuaID=row.id_yechida;
      //this.remoteSrv.refresh();
    }
  }
  OvedChange(value) {
    let users = this.lstOvdim.slice().filter((s) => s.full_name.toLowerCase().indexOf(value.toLowerCase()) !== -1);
    if (users.length == 1) {
      this.remoteSrv.OvedId = Number(users[0].k_user);
      this.remoteSrv.refresh();
    }
    else {
      this.remoteSrv.OvedId = null;
      this.remoteSrv.refresh();
    }
  }
  autoCompFilter(value) {
    this.sidurAvodaService.getOvdimPnuim(this.dtMeDate,null,this.IdYechidaMevatzat,null,
      this.ConvertDayOfWeekToInt(this.dtMeDate)
      ,null,0,1000,null,null,"",value)
    .subscribe((data)=>{
      this.lstOvdim = data.Data;
    });
    /*this.ovedSrv.GetOvdimByName(value).subscribe((data) => {
      this.lstOvdim = data;
    });*/
  }
}
