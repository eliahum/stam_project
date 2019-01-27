import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { KeyValuePair, ISugMesima } from '../..';
import { State, SortDescriptor } from '@progress/kendo-data-query';
import { UserDataService } from 'src/app/shared/services/user-data.service';
import * as moment from 'moment';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { GridComponent, GridDataResult } from '@progress/kendo-angular-grid';
import { IntlService } from '@progress/kendo-angular-intl';
import { MessageService, DialogService } from 'primeng/api';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import { TavlaotAv } from '../../shared/types/tavlaot-av';
import { TavlaotAvRemoteDataService } from './nechul-tavlaot-av-remote-data.service';
import { NechulTavlaotAvService } from '../../shared/services/nechul-tavlaot-av.service';
import { YesNoDialogComponent } from '../../components';
import { ValidateKodMesimaTaken } from './async-kod-mesima.validator';



@Component({
  selector: 'nechul-tavlaot-av',
  templateUrl: './nechul-tavlaot-av.component.html',
  styleUrls: ['./nechul-tavlaot-av.component.scss']
})
export class NechulTavlaotAvComponent implements OnInit {
  public tavlaotColumnMap = [
    { tableIds: [5, 10], column: ["kod_mesima"] },
    { tableIds: [6, 11], column: ["k_sug_mesima"] },
    { tableIds: [8], column: ["kamut", "sw_male"] }
  ]

  public view: Observable<GridDataResult>;
  public tablaotAvForm: FormGroup;
  tavlaotAv: TavlaotAv = new TavlaotAv();
  NIUD_DELETE_CONFIRM = "האם למחוק ניוד עובד ?";
  public dtMeDate: Date = new Date(moment(this.userData.TaarichSidur).add(0, 'day').format("MM/DD/YYYY"));//this.userData.TaarichSidur;
  public dtAdDate: Date = new Date(moment(this.userData.TaarichSidur).add(7, 'day').format("MM/DD/YYYY"));
  public swPail = { text: "כן", value: 1 };
  public zmanHatchala: Date = new Date(moment(this.userData.TaarichSidur).add(0, 'day').format("MM/DD/YYYY"));//this.userData.TaarichSidur;
  public zmanSof: Date = new Date(moment(this.userData.TaarichSidur).add(7, 'day').format("MM/DD/YYYY"));
  private editedRowIndex: number;
  private selectedColumnSet = ["kod_mesima"];
  public tableList: Array<KeyValuePair> = [];
  public kenLoList: Array<{ text: string, value: number }> = [
    { text: "לא", value: 0 },
    { text: "כן", value: 1 }
  ];
  public currentErrorMsg = '';
  public sort: SortDescriptor[] = [{
    field: 'kod_mesima',
    dir: 'asc'
  }];
  public gridState: State = {
    sort: this.sort,
    skip: 0,
    take: 10
  };  
  formErrors = {
    'kod_mesima': '',
    'teur_premia': '',
    'premia': '',
    'kod_sug_mesima': '',
    'kamut': ''
  };
  validationMessages = {
    'kod_mesima': {
      'required':      'אזור שדה חובה',
      'kodMesimaExists': 'נתון כפול, נא שנה מספר אזור '
     // 'pattern':     'Name must be at least 4 characters long.',
    },
    'teur_premia': {
      'required': 'תאור שדה חובה'
    },
    'premia': {
      'required': 'פרמייה יומית שדה חובה',
      'min':"ערך בשדה 'פרמיה יומית חייב להיות בטווח בין '0' ל '15'",
      'max':"ערך בשדה 'פרמיה יומית חייב להיות בטווח בין '0' ל '15'"
    },
    'kamut': {
      'required': 'כמות מיכליות שדה חובה',
      'min': "ערך בשדה 'כמות מיכליות חייב להיות בטווח בין '0' ל '100' ",
      'max': "ערך בשדה 'כמות מיכליות חייב להיות בטווח בין '0' ל '100' ",
    }
  };
  public tableId = { value: "פרמיות יעודיות", key: "5" };
  constructor(private remoteSrv: TavlaotAvRemoteDataService,
    private userData: UserDataService,
    private intl: IntlService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    public dialogService: DialogService,
    private nechulTavlaotAvService: NechulTavlaotAvService,
    private changeDetector: ChangeDetectorRef
  ) {
    this.remoteSrv.zmanHatchala = this.zmanHatchala;
    this.remoteSrv.zmanSof = this.zmanSof;
    this.remoteSrv.swPail = this.swPail.value;
    this.remoteSrv.tableId = +this.tableId.key;
  }
  public createFormGroup(args: any): FormGroup {
    const item = (args.isNew ? this.tablaotAvForm : args.dataItem) as TavlaotAv;
    let kamutVisibile = this.checkIfColumnVisibile("kamut") ? [{ value: item.kamut, disabled: !args.isNew }, [Validators.required, Validators.min(0),Validators.max(100)]] : [{ value: item.kamut, disabled: !args.isNew }];
    let kodSugMesimaVisibile = this.checkIfColumnVisibile("k_sug_mesima") ? [{ value: item.k_sug_mesima }, [Validators.required]] : [{ value: item.k_sug_mesima }];
    let kodMesima = this.checkIfColumnVisibile("kod_mesima") ? [{value: item.kod_mesima,  disabled: !args.isNew} , [Validators.required], ValidateKodMesimaTaken.kodMesimaValidator(this.nechulTavlaotAvService)] : [{value: item.kod_mesima,  disabled: !args.isNew}];
    // [Validators.pattern("^[0-9]{5}")]
    this.tablaotAvForm = this.formBuilder.group({
      "id_premia_tavlat_av": item.id_premia_tavlat_av,
      "kod_mesima": kodMesima,
      "teur_premia": [item.teur_premia, [Validators.required]],
      "premia": [item.premia, [Validators.required, Validators.min(0),Validators.max(15)]],
      "zmanHatchala": [new Date(item.zman_hatchala)],
      "zmanSof": [new Date(item.zman_sof)],
      "full_name": [item.full_name],
      "swPail": [item.sw_pail],
      "simochin": [item.simochin],
      "heara": [item.heara],
      "kod_sug_mesima":kodSugMesimaVisibile,
      "kamut": kamutVisibile
    }); //
    if (args.isNew) {
      this.tablaotAvForm.controls.zmanHatchala.setValue(this.zmanHatchala);
      this.tablaotAvForm.controls.zmanSof.setValue(this.zmanSof);
    }
    else {
    }

    //this.tablaotAvForm.valueChanges
    //  .subscribe(data => this.onValueChanged(data));
    //  this.onValueChanged();
    return this.tablaotAvForm;
  }
  
  onValueChanged(data?: any) {
    if (!this.tablaotAvForm) { return; }
    const form = this.tablaotAvForm;
var msg = '';
    for (const field in this.formErrors) {
      if((form.get(field) as FormGroup).controls ) {
        for(const subfield in (form.get(field) as FormGroup).controls) {
          this.formErrors[field][subfield] = '';
          const control = (form.get(field) as FormGroup).controls[subfield];
          if (control && control.dirty && !control.valid) {
            const messages = this.validationMessages[subfield];
            for (const key in control.errors) {
              this.formErrors[field][subfield] += messages[key] + ' ';
              msg += messages[key] + '\n';
            }
          }
        }
      } 
      else {
        const control = form.get(field);
        this.formErrors[field] = '';
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            this.formErrors[field] += messages[key] + ' ';
            msg += messages[key] + '\n';
          }
        } 
      }
    }
    if(msg && msg != this.currentErrorMsg) {
        this.currentErrorMsg = msg;
        this.messageService.add({ key: 'success', severity: 'error', life: 4000, detail: this.currentErrorMsg }); 
      }
    }

  checkIfColumnVisibile(columnName: string) {
    return this.selectedColumnSet.filter(x => x == columnName)[0];
  }
  setColumnVisibility() {
    this.tavlaotColumnMap.forEach(i => {
      var tableIdKey = i.tableIds.filter(x => x == +this.tableId.key)[0];
      if (tableIdKey) {
        this.selectedColumnSet = i.column;
        return;
      }
    });
  }
  createForm(): any {
    this.tablaotAvForm = this.formBuilder.group({
      "id_premia_tavlat_av": [this.tavlaotAv.id_premia_tavlat_av],
      "kod_mesima": [this.tavlaotAv.kod_mesima, [Validators.required, Validators.minLength(5),
      Validators.maxLength(5)], ValidateKodMesimaTaken.kodMesimaValidator(this.nechulTavlaotAvService)],
      "teur_premia": [this.tavlaotAv.teur_premia, [Validators.required]],
      "premia": [this.tavlaotAv.premia, [Validators.required]],
      "zmanHatchala": [new Date(this.tavlaotAv.zman_hatchala)],
      "zmanSof": [new Date(this.tavlaotAv.zman_sof)],
      "full_name": [this.tavlaotAv.full_name],
      "swPail": [this.tavlaotAv.sw_pail],
      "simochin": [this.tavlaotAv.simochin],
      "heara": [this.tavlaotAv.heara],
      "kod_sug_mesima": [this.tavlaotAv.k_sug_mesima],
      "kamut": [this.tavlaotAv.kamut]
    });
  }


  ngOnInit() {
    this.nechulTavlaotAvService.GetSugeiPremiaTavlaotAv().subscribe((sugeiPremiaTavlaotAv) => this.tableList = sugeiPremiaTavlaotAv)
    this.createForm();
  }
  OnCloseSugMesima(row: ISugMesima) {
    if (row != 'empty') {
      {
        this.tablaotAvForm.controls.kod_sug_mesima.setValue(row.kod_sug)
        // this.tablaotAvForm.controls.teur_sug_mesima.setValue(row.teur_sug)
      }
    }
  }

  OnSugMesimaChanged({ sugMesimaData, parentrow, action }) {
    if (action != 'init') {
      if (sugMesimaData != null) {
        let data = (sugMesimaData as ISugMesima);
        // parentrow.kod_sug = data.kod_sug;

        this.tablaotAvForm.controls.kod_sug_mesima.setValue(data.kod_sug)
        // this.tablaotAvForm.controls.kod_sug_mesima.markAsDirty();
      }
    }
  }

  private closeEditor(grid, rowIndex = this.editedRowIndex) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
  }
  public cancelHandler({ sender, rowIndex }) {
    this.closeEditor(sender, rowIndex);
  }

  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);
    this.tablaotAvForm = this.createFormGroup({ isNew: false, dataItem: dataItem })
    this.editedRowIndex = rowIndex;
    sender.editRow(rowIndex, this.tablaotAvForm);
  }

  public OnHazeg() {
    this.setColumnVisibility();
    let dtMeDate = moment(this.dtMeDate);
    if (!dtMeDate.isValid())
      this.messageService.add({ key: 'success', severity: 'error', life: 4000, detail: " תאריך סיום לא תקין" });
    let dtAdDate = moment(this.dtAdDate);
    if (!dtAdDate.isValid())
      this.messageService.add({ key: 'success', severity: 'error', life: 4000, detail: " תאריך סיום לא תקין" });
    let days = dtAdDate.diff(dtMeDate, 'days');
    if (days < 0)
      this.messageService.add({ key: 'success', severity: 'error', life: 4000, detail: "תאריך התחלה לא יכול להיות גדול מתאריך סיום" });

    this.remoteSrv.zmanHatchala = this.zmanHatchala;
    this.remoteSrv.zmanSof = this.zmanSof;
    this.remoteSrv.swPail = this.swPail.value;
    this.remoteSrv.tableId = +this.tableId.key;
    this.remoteSrv.refresh();
  }
  public removeHandler({ dataItem }) {
    let tavlaotAvData = dataItem as TavlaotAv;

    this.opendialogAndDoYes("שאלה", this.NIUD_DELETE_CONFIRM, "220px")
      .subscribe((result) => {
        if (result == "yes") {
          this.nechulTavlaotAvService.DeleteTavlaotAv(tavlaotAvData).subscribe(() => {
            this.messageService.add({ key: 'success', severity: 'success', life: 2000, detail: 'שמירה בוצע בהצלחה.' });
            this.remoteSrv.refresh();
          });

        }
      });
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

  public addHandler({ sender }) {
    this.closeEditor(sender);
    let frmGroup = this.createFormGroup({ isNew: true });
    sender.addRow(frmGroup);
    this.changeDetector.detectChanges();
  }
  public saveHandler({ sender, rowIndex, formGroup, isNew }) {
    if(! this.tablaotAvForm.valid){
      this.messageService.add({ key: 'success', severity: 'error', life: 4000, detail: this.currentErrorMsg });
      return;
    }
    if( this.tablaotAvForm.valid){
     
      const obj: TavlaotAv = formGroup.value;
      let tavlaotAvData = {
        "id_premia_tavlat_av": (obj.id_premia_tavlat_av ? obj.id_premia_tavlat_av.toString() : "-1"),
        "kod_mesima": obj.kod_mesima,
        "teur_premia": obj.teur_premia,
        "premia": obj.premia,
        "zman_hatchala": this.intl.formatDate(obj.zman_hatchala, 'yyyy-MM-dd'),
        "zman_sof": this.intl.formatDate(obj.zman_sof, 'yyyy-MM-dd'),
        "full_name": obj.full_name,
        "sw_pail": obj.sw_pail,
        "simochin": obj.simochin,
        "heara": obj.heara,
        "tableId": +this.tableId.key
      };
      this.manageNewTavlaotAv(tavlaotAvData, isNew).subscribe(() => { });
      sender.closeRow(rowIndex);
    }
  }
  manageNewTavlaotAv(tavlaotAvData: any, isNew: boolean): any {
    return Observable.create(observer => {
      if (isNew) {
        this.nechulTavlaotAvService.InsertTavlaotAv(tavlaotAvData).subscribe(() => {
          this.messageService.add({ key: 'success', severity: 'success', life: 2000, detail: 'שמירה בוצע בהצלחה.' });
          this.remoteSrv.refresh();
          observer.next(1);
        });
      }
      else {
        this.nechulTavlaotAvService.UpdateTavlaotAv(tavlaotAvData).subscribe(() => {
          this.messageService.add({ key: 'success', severity: 'success', life: 2000, detail: 'שמירה בוצע בהצלחה.' });
          this.remoteSrv.refresh();
          observer.next(2);
        });
      }
    });
  }
  public onBlurMeDate() {
    this.remoteSrv.zmanHatchala = this.dtMeDate;
    this.remoteSrv.refresh();
  }
  public dtAdChange(value: Date) {
    this.remoteSrv.zmanSof = value;
    this.remoteSrv.refresh();
  }

}
