import { OvedNgComponent } from './../../components/oved-ng/oved-ng.component';
import { TvrTikunRechev } from './../../shared/types/tikun-rechev';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild, QueryList, ViewChildren, ViewContainerRef } from '@angular/core';
import { DialogService as DialogServiceKendo, DialogResult } from '@progress/kendo-angular-dialog';
import { DynamicDialogRef, DynamicDialogConfig, MessageService, DialogService } from 'primeng/api';
import { TikuneiRechevService, TikunRechevDetails, IRechevPanui, ComboItem, GoremMetaken, IOvedPanui, RechevService, DayOfWeek, Yamim } from '../..';
import { UserDataService } from 'src/app/shared/services/user-data.service';
import * as moment from 'moment';
import { DictionaryService } from '../../shared/services/dictionary.service';
import { nehagLeTikunValidator } from './validators';
import { IntlService } from '@progress/kendo-angular-intl';
import { RechevNgComponent, YesNoDialogComponent } from '../../components';
import { Observable } from 'rxjs/Observable';
import { SidurAvodaService } from '../../shared/services/sidur-avoda.service';
import { markedTrigger } from './animations';



@Component({
  selector: 'app-tikun-rechev',
  templateUrl: './tikun-rechev.component.html',
  styleUrls: ['./tikun-rechev.component.scss'],
  animations: [
    markedTrigger
    // animation triggers go here
  ]
})
export class TikunRechevComponent implements OnInit {

  tikunForm: FormGroup;
  data: TikunRechevDetails;
  heara: string;
  mispar_pnimi: string;
  isHusar: boolean = true;
  zmanHatchala: Date;
  disableForm: boolean = false;
  isNew: boolean = false;
  tvrTikunRechev: TvrTikunRechev;
  mispar_pnimi_old: string;
  mustReturnNehag: boolean = false;
  mustReturnDate: boolean = false;
  mustRechev: boolean = false;
  mustNahag: boolean;
  sugRechev: number;
  OvedLeTikunVis: boolean = false;
  OvedMeTikunVis: boolean = false;




  @ViewChild(RechevNgComponent)
  rechavimNgPnuimDlg: RechevNgComponent;

  @ViewChild("container", { read: ViewContainerRef })
  public containerRef: ViewContainerRef;

  @ViewChildren(OvedNgComponent)
  listOvdimDlgs: QueryList<OvedNgComponent>;
  public selectedItem: { text: string, value: number };
  public listItems: ComboItem[] = [

  ];
  constructor(private ref: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    public dialogService: DialogService,
    private fb: FormBuilder,
    private tikunsrv: TikuneiRechevService,
    private usrData: UserDataService,
    private dictSrv: DictionaryService,
    private messageService: MessageService,
    private dialogServiceKendo: DialogServiceKendo,
    private rechevSrv: RechevService,
    private sidurSrv: SidurAvodaService

  ) {

  }

  createFormGroup(row: any): FormGroup {

    let zmanSof = row.zman_sof ? moment(row.zman_sof).toDate() : null;
    let form: FormGroup = this.fb.group({
      'id_tikuni_mashab': row.id_tikuni_mashab,
      'heara': row.heara,
      'mispar_pnimi': [row.mispar_pnimi, Validators.required],
      'mispar_rishui_netzer': row.id_mashab,
      'zman_hatchala': moment(row.zman_hatchala).format("DD/MM/YYYY"),
      'zman_sof': row.zman_sof ? moment(row.zman_sof).toDate() : null,
      'nahag_full_name': [row.nahag_full_name, Validators.required],
      'is_husar_sidur': row.is_husar_sidur,
      'k_user': row.k_user,
      'k_user1': row.k_user1,
      'nahag_full_name1': ['', nehagLeTikunValidator(zmanSof)],
      'sw_metokan': row.sw_metokan,
      'goremId': new FormControl()
    });
    this.mispar_pnimi_old = row.mispar_pnimi;
    return form;
  }
  ngOnInit() {

    this.tvrTikunRechev = new TvrTikunRechev();

    let row = this.dialogConfig.data.dataItem;

    this.tvrTikunRechev.MisparRishuiNetzerOld = this.dialogConfig.data.dataItem.mispar_rishui_netzer;

    this.isNew = !this.dialogConfig.data.dataItem.id_tikuni_mashab


    this.mispar_pnimi = row.mispar_pnimi;

    let parentThis = this;
    this.tikunForm = this.fb.group({
      'id_tikuni_mashab': '',
      'heara': '',
      'mispar_pnimi': ['', Validators.required],
      'mispar_rishui_netzer': '',
      'zman_hatchala': '',
      'zman_sof': null,
      'nahag_full_name': ['', Validators.required],
      'nahag_full_name1': '',
      'is_husar_sidur': '',
      'k_user': '',
      'k_user1': '',
      'sw_metokan': '',
      'goremId': new FormControl()
    });
    this.dictSrv.getData<any>("gormim_metaknim").subscribe((result) => {
      this.listItems = result;
    });


    if (!this.isNew) {
      this.tikunsrv.GetTikunRechev(row.id_tikuni_mashab).subscribe(result => {
        let zmanSof = parentThis.dialogConfig.data.dataItem.zman_sof ? moment(parentThis.dialogConfig.data.dataItem.zman_sof).toDate() : null;
        this.data = result;
        this.tikunForm = this.createFormGroup(parentThis.dialogConfig.data.dataItem);
        this.tikunForm.controls.goremId.setValue(parentThis.dialogConfig.data.dataItem.id_gorem_metaken);

        this.tikunForm.controls.sw_metokan.setValue(parentThis.dialogConfig.data.dataItem.sw_metokan);
        this.OvedLeTikunVis = true;
        this.OvedMeTikunVis = true;
        this.tikunForm.valueChanges
          .subscribe(data => this.onValueChange(data));

        this.onValueChange();
      });
    }

    if (this.isNew) {
      this.tikunForm.controls.zman_hatchala.setValue(moment(this.usrData.Today).format("DD/MM/YYYY"));
      this.zmanHatchala = moment(this.usrData.Today).toDate();
      this.tikunForm.controls.goremId.setValue(36);

    }
    else
      this.zmanHatchala = this.dialogConfig.data.dataItem.zman_hatchala;


    this.isHusar = this.dialogConfig.data.dataItem.is_husar_sidur == 1;


    if (this.isNew) {
      this.tikunForm.valueChanges
        .subscribe(data => this.onValueChange(data));

      this.onValueChange();
    }

  }

  onValueChange(data?: any) {
    if (!this.tikunForm) return;
    let form = this.tikunForm;

    if (form.controls.zman_sof.value && !form.controls.nahag_full_name1.value) {
      this.mustReturnNehag = true;
    }
    else {
      this.mustReturnNehag = false;
    }

    if (!form.controls.zman_sof.value && form.controls.nahag_full_name1.value) {
      this.mustReturnDate = true;
    }
    else {
      this.mustReturnDate = false;
    }

    this.mustRechev = !form.controls.mispar_rishui_netzer.value;
    this.mustNahag = !form.controls.nahag_full_name.value;




    this.disableForm = (form.invalid || form.controls.sw_metokan.value == 1) ||
      this.mustReturnNehag || this.mustReturnDate || this.mustRechev || this.mustNahag
      ;

  }
  ClickOved(event: MouseEvent, id: string) {
    let ovedTikunDlg = this.listOvdimDlgs.find(row => row.Id == id);
    ovedTikunDlg.SugRechev = this.sugRechev.toString();
    ovedTikunDlg.onOpenDialog();
    ovedTikunDlg.SetModel("empty", this.usrData.Today, null, null,
      null, null, null);
  }
  ClickRechev() {
    this.rechavimNgPnuimDlg.onOpenDialog();

    this.rechavimNgPnuimDlg.SetModel("empty", this.usrData.Today, null,
      "204", 1, null,
      -1);
  }
  OnCloseRechev(row: IRechevPanui) {

    this.sugRechev = row.sug_rechev;
    this.OvedLeTikunVis = true;
    this.OvedMeTikunVis = true;
    this.tikunForm.controls.mispar_pnimi.setValue(row.mispar_pnimi);
    this.tikunForm.controls.mispar_rishui_netzer.setValue(row.mispar_rishui_netzer);
  }
  OnCloseOvedLeTikun(row: any) {
    if (row != 'empty') {
      let oved = row as IOvedPanui;
      this.OvedLeTikunVis = true;
      this.OvedMeTikunVis = true;
      this.tikunForm.controls.nahag_full_name.setValue(oved.full_name);
      this.tikunForm.controls.k_user.setValue(oved.k_user);
    }
  }
  OnCloseOvedMeTikun(row: any) {
    if (row != 'empty') {
      let oved = row as IOvedPanui;
      this.tikunForm.controls.nahag_full_name1.setValue(oved.full_name);
      this.tikunForm.controls['nahag_full_name1'] = new FormControl(this.tikunForm.controls.nahag_full_name1.value, nehagLeTikunValidator(this.tikunForm.controls.zman_sof.value));

      this.tikunForm.controls.k_user1.setValue(oved.k_user);
    }
  }
  fillTikunObject() {

  }
  public opendialogAndDoYes(title: string, question: string, height: string): Observable<any> {
    const dialogRef = this.dialogService.open(YesNoDialogComponent, {
      header: 'שאלה',
      width: '200px',
      height: height,
      autoZIndex: true,
      data: {
        question: question,
        title: title
      },
      rtl: true
    });

    return dialogRef.onClose;

  }
  public opendialogAndDoYesKendo(title: string, content: string): Observable<DialogResult> {


    const dialogRef = this.dialogServiceKendo.open({
      appendTo: this.containerRef,

      title: title,
      content: content,
      actions: [{ text: "כן" }, { text: "לא" }]
    });



    return dialogRef.result;

  }
  onYesClick() {
    let TIKUNEI_RECHEV_ElPASSED_PERIOD_ERROR = "לא ניתן לשנות דיווח תקלה, תמה תקופת הזמן המותרת לביצוע השינוי";

    let tvrTikunRechev = this.tvrTikunRechev;
    tvrTikunRechev.TikunMashabId = this.tikunForm.controls.id_tikuni_mashab.value;
    tvrTikunRechev.MisparRishuiNetzer = this.tikunForm.controls.mispar_rishui_netzer.value;
    tvrTikunRechev.MisparPnimi = this.tikunForm.controls.mispar_pnimi.value;
    tvrTikunRechev.ZmanHatchala = this.zmanHatchala;
    tvrTikunRechev.ZmanSof = this.tikunForm.controls.zman_sof.value;
    tvrTikunRechev.NahagId = this.tikunForm.controls.k_user.value;
    tvrTikunRechev.NahagMetikunId = null;
    tvrTikunRechev.GoremMetakenId = this.tikunForm.controls.goremId.value;
    tvrTikunRechev.SugTikunId = 1;
    tvrTikunRechev.IsFixed = 0;
    tvrTikunRechev.GoremMedaveachId = null;
    tvrTikunRechev.GoremMedaveachMetikunId = null;
    tvrTikunRechev.Heara = this.tikunForm.controls.heara.value;
    tvrTikunRechev.Deleted = 0;
    tvrTikunRechev.IsHusarSidur = null;
    tvrTikunRechev.ObjectId = null;
    let parentThis = this;
    this.tikunsrv.CheckBeforeInsertTikuneiRechev(tvrTikunRechev).subscribe((result) => {
      if (result == "ok") {
        tvrTikunRechev.IsHusarSidur = 0;
        this.ref.close(tvrTikunRechev);
      }
      else {
        this.opendialogAndDoYesKendo("שאלה", result).subscribe((answer: any) => {
          if (answer.text == "כן") {
            tvrTikunRechev.IsHusarSidur = 1;
            this.ref.close(tvrTikunRechev);
          }
        });

      }
    },
      resultError => {
        if (resultError.error.Message)
          this.messageService.add({ key: 'success', severity: 'error', life: 4000, detail: resultError.error.Message });
        else
          this.messageService.add({ key: 'success', severity: 'error', life: 4000, detail: resultError });

      });

  }
  public ConvertDayOfWeekToInt(date: Date): number {
    let result: number = 0;
    switch (date.getDay()) {
      case DayOfWeek.Friday:
        result = Yamim.Friday;
        break;

      case DayOfWeek.Monday:
        result = Yamim.Monday;
        break;

      case DayOfWeek.Saturday:
        result = Yamim.Saturday;
        break;

      case DayOfWeek.Sunday:
        result = Yamim.Sunday;
        break;

      case DayOfWeek.Thursday:
        result = Yamim.Thursday;
        break;

      case DayOfWeek.Tuesday:
        result = Yamim.Tuesday;
        break;

      case DayOfWeek.Wednesday:
        result = Yamim.Wednesday;
        break;
    }
    return result;

  }
  ChangeMisparPnimi(mispar_pnimi: string) {
    let RECHEV_BE_MOSACH = "שים לב, הרכב המבוקש במוסך/ לא ניתן לבחירה";

    let parentThis = this;
    if (mispar_pnimi.trim() == '') {
      this.OvedLeTikunVis = false;
      this.OvedMeTikunVis = false;
      this.tikunForm.controls.mispar_rishui_netzer.setValue('');
      return;
    }
    this.sidurSrv.getRechevPanui(moment(this.zmanHatchala).toDate(), null, "",
      mispar_pnimi, this.ConvertDayOfWeekToInt(moment(this.zmanHatchala).toDate()), 1, 1000,
      null,
      null, null, null, '').
      subscribe(rechev => {

        if (rechev.mispar_pnimi == "-1") {
          this.messageService.add({ key: 'success', severity: 'error', life: 4000, detail: 'הרכב שבחרת לא נמצא' });
          this.tikunForm.controls.mispar_pnimi.setValue(parentThis.mispar_pnimi_old);
        }
        else if (rechev.IsRechevBetikun == 1) {
          this.messageService.add({ key: 'success', severity: 'error', life: 4000, detail: RECHEV_BE_MOSACH });
        }
        else {
          this.mispar_pnimi_old = mispar_pnimi;
          this.tikunForm.controls.mispar_rishui_netzer.setValue(rechev.mispar_rishui_netzer);
          this.OvedLeTikunVis = true;
          this.OvedMeTikunVis = true;
        }
      });
    /*   this.rechevSrv.GetRechevDetailsByMisparPnimi(mispar_pnimi).subscribe((result)=>{
      
      this.tikunForm.controls.mispar_rishui_netzer.setValue(result.mispar_rishui_netzer);

    });*/
  }
  onNoClick() {
    this.ref.close(null);
  }
}
