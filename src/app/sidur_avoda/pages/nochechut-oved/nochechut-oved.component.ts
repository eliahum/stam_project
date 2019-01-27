import { Component, OnInit, HostListener, ViewChild, TemplateRef, HostBinding } from '@angular/core';
import { INochechutOved, INochechut, NochechutOvedService } from '../../index';
import { LazyLoadEvent } from 'primeng/api';
import { MessageService, SelectItem } from 'primeng/primeng';
import { ActivatedRoute, Params, Router } from '@angular/router';
import * as $ from "jquery";
import { IntlService } from '@progress/kendo-angular-intl';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';
import { UserDataService } from 'src/app/shared/services/user-data.service';
import { IPirteiOved } from '../../shared/types/pirtei_oved';
import { PirteiOvedComponent } from '../../components/pirtei-oved/pirtei-oved.component';
import { State } from '@progress/kendo-data-query';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { NochechutOvedRemoteDataService } from './nochechut-oved-remote-data.service';
import { DictionaryService } from '../../shared/services/dictionary.service';
import { PopupService, PopupRef } from '@progress/kendo-angular-popup';
import { DialogService, DialogCloseResult, DialogRef } from '@progress/kendo-angular-dialog';

@Component({
  selector: 'nochechut-oved',
  templateUrl: 'nochechut-oved.component.html',
  styleUrls: ['nochechut-oved.component.scss'],
  animations: [
    trigger('clickedState', [
      state('default', style({
      })),
      state('clicked', style({
        backgroundColor: 'red',


      })),
      state('onrawover', style({
        border: '2px solid black'
      })),
      transition('default => onrawover', [
        animate('0.5s')
      ]),
      transition('default => clicked', [
        animate('200ms ease-out', style({
          transform: 'scale(1.05)'
        })),
        animate(200),
        animate('200ms ease-out', style({
          transform: 'scale(0.95)'
        })),
        /*animate("1s", keyframes([
          style({ backgroundColor: "red", offset: 0 }),
          style({ backgroundColor: "blue", offset: 0.2 }),
          style({ backgroundColor: "orange", offset: 0.3 }),
          style({ backgroundColor: "black", offset: 1 })
        ]))*/
        //animate('0.5s')
      ]),
      transition('clicked => default', [
        animate('0.5s')
      ]),
    ])
  ]
})
export class NochechutOvedComponent implements OnInit {
  harshaa: number = 0;
  screenDisabled: boolean = false;
  onlySpecipicYechida: boolean = true;
  oved: IPirteiOved;
  @ViewChild(PirteiOvedComponent)
  pirteiOved: PirteiOvedComponent;
  @ViewChild('template')
  myTemplate: TemplateRef<any>;
  currentUser: number;
  sibot_headruyot: SelectItem[] = new Array<SelectItem>();
  sibot_headruyottmp: SelectItem[] = new Array<SelectItem>();
  hospital: string;
  currentHeara: string;
  public formGroups: FormGroup = new FormGroup({ items: new FormArray([]) });



  public gridState: State = {
    sort: [],
    skip: 0,
    take: 50
  };

  private popupRef: PopupRef;
  constructor(
    private dialogService: DialogService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private userData: UserDataService,
    private router: Router,
    private remoteSrv: NochechutOvedRemoteDataService,
    private nochechutSrv: NochechutOvedService,
    private formBuilder: FormBuilder,
    private dictSrv: DictionaryService
  ) { }

  ngOnInit() {
    /*this.activatedRoute.params.forEach((params: Params) => {
      let id = +params["id"];
      this.currentUser = Number(id);
    });*/
    this.activatedRoute.data.forEach((data: { oved: IPirteiOved, harshaa: any }

    ) => {
      this.oved = data.oved;
      this.currentUser = this.oved.k_user;
      this.pirteiOved.Oved = data.oved;
      this.harshaa = data.harshaa;
      this.screenDisabled = (this.harshaa == 16 || this.harshaa == 64);
      this.onlySpecipicYechida = (this.harshaa == 16 || this.harshaa == 32);
    });
    let local = this;
    this.remoteSrv.subscribe(
      row => {
        this.formGroups = new FormGroup({ items: new FormArray([]) });
        if (row != null) {

          row.data.forEach(i => {
            let formGroup = this.formBuilder.group({
              'teur_sug_headrut': (i.teur_sug_headrut == null) ? '' : i.teur_sug_headrut,
              'id_sug_headrut': i.id_sug_headrut
            });
            (<FormArray>local.formGroups.controls['items']).push(formGroup);
          });
        }
      }
    );

    this.dictSrv.getData<any>("sibot_headrut").subscribe(result => {
      let sibot_headrut = result;
      this.sibot_headruyot.push({ label: '', value: -1 });
      for (var i = 0; sibot_headrut.length > i; i++) {
        this.sibot_headruyot.push({ label: sibot_headrut[i].text, value: sibot_headrut[i].value });
      }
      this.sibot_headruyottmp = this.sibot_headruyot.slice();
    });



  }
  public cellClickHandler({ sender, rowIndex, columnIndex, dataItem, isEdited }) {
    if (!this.screenDisabled) {
      if (sender.columns._results[columnIndex].field == "heara") {
        this.showConfirmation(null, dataItem);
      }
    }
  }
  public showConfirmation(template: TemplateRef<any>, dataItem: INochechutOved) {
    template = this.myTemplate;
    this.currentHeara = dataItem.heara;
    const dialog: DialogRef = this.dialogService.open({
      title: 'שמירת הערה',
      content: template,
      actions: [
        { text: 'סגור' },
        { text: 'שמור', primary: true }
      ]
    });
    dialog.result.subscribe((result) => {
      if (result instanceof DialogCloseResult) {
        console.log('close');
      } else {
        if (result.text != "סגור") {
          dataItem.heara = this.currentHeara;
          this.OnSaveHeadrut(dataItem);
          console.log('action', result);
        }
      }


    });
  }
  public HeadrutChange(value, dataItem: INochechutOved): void {

    let item = this.sibot_headruyot.find(row => row.label == value);
    if (item) {
      dataItem.id_sug_headrut = item.value;
      this.OnSaveHeadrut(dataItem);
    }
  }
  autoCompFilter(value) {
    this.sibot_headruyottmp = this.sibot_headruyot.slice().filter((s) => s.label.toLowerCase().indexOf(value.toLowerCase()) !== -1);
  }
  OnReturnNochechut() {
    this.router.navigate(["/headrut"]);
  }
  public onSibatHeadrutChange(e, dataItem: INochechutOved) {
    dataItem.id_sug_headrut = e;
    this.OnSaveHeadrut(dataItem);
  }

  OnSaveHeadrut(dataItem: INochechutOved) {

    this.nochechutSrv.SaveHeadrut(dataItem.tr, dataItem.tr,
      dataItem.k_user, this.userData.IdYechidaMevatzat, dataItem.heara, dataItem.id_sug_headrut)
      .subscribe(rows => {

        this.messageService.add({ key: 'success', severity: 'success', life: 2000, detail: 'שמירה בוצע בהצלחה' });
        //this.RefreshNochechutOved(this.skip);
      },
        error =>
          this.messageService.add({ key: 'success', severity: 'error', life: 2000, detail: error.message })
      );

  }


}
