import { BasePageSidurComponent } from './../base-page-sidur/base-page-sidur-component';
import { Component, OnInit } from '@angular/core';
import {  INochechut, SidurAvodaService, IYechidaIrgunit, NochechutOvedService } from '../../index';
import { LazyLoadEvent } from 'primeng/api';
import * as $ from "jquery";
import { IntlService } from '@progress/kendo-angular-intl';
import { MessageService, SelectItem } from 'primeng/primeng';
import { Router, ActivatedRoute } from '@angular/router';
import { UserDataService } from 'src/app/shared/services/user-data.service';
import * as moment from 'moment';
import { DictionaryService } from '../../shared/services/dictionary.service';
import { State, process } from '@progress/kendo-data-query';
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { FormBuilder,FormGroup,FormArray } from '@angular/forms';


import { Observable } from 'rxjs-compat/Observable';
import { HeadrutRemoteDataService } from './headrut-remote-data.service';


@Component({
  selector: 'headrut-ng',
  templateUrl: 'headrut-ng.component.html',
  styleUrls: ['headrut-ng.component.scss']
})
export class HeadrutNgComponent  extends BasePageSidurComponent implements OnInit {
  cols = [
    { header: '', width: '6px' },
    { header: '', width: '6px' },
    { header: 'שם עובד', width: '35px' },
    { header: 'מס ת"ז', width: '55px' },
    { header: 'מס נהג', width: '50px' },
    { header: 'תפקיד', width: '50px' },
    { header: 'העדרות', width: '50px' },
    { header: '', width: '10px' }

  ];

  public taarichSidur: Date = this.userData.TaarichSidur;
  KodYechidaMevazaat: number = this.userData.KodYechidaMevatzat;

  loading: boolean = false;
  skip: number = 0;
  skipOvedData: number = 0;
  pageSize = 12;
  lstNochechut: INochechut[];
  public gridView: GridDataResult;
  totalRecords: number;
  selectedNochechut: INochechut;
  sibot_headruyot: SelectItem[] = new Array<SelectItem>();
  private editedRowIndex: number;
  private editedNochechut: INochechut;
  public formGroup: FormGroup;
   public formGroups: FormGroup = new FormGroup({ items: new FormArray([])});
  private data: any[];
  public gridState: State = {
    sort: [],
    skip: 0,
    take: 12
  };

  public buttonCount = 5;
  public info = true;
  public type: 'numeric' | 'input' = 'numeric';
  public pageSizes = true;
  public previousNext = true;
  public view: Observable<GridDataResult>;
  private dropDownData: string[] = [];

  constructor(
    private router: Router, private formBuilder: FormBuilder,
    private sidurService: SidurAvodaService,
    private nochechutSrv: NochechutOvedService,
    private messageService: MessageService,
    private intl: IntlService, private dictSrv: DictionaryService,
    private headrutRemoteDataService: HeadrutRemoteDataService,
    protected activatedRoute:ActivatedRoute,
    private userData: UserDataService) {
      super(activatedRoute);
    this.createFormGroup = this.createFormGroup.bind(this);
  }

  ngOnInit() {
  super.ngOnInit();
   let local=this;
    this.view = this.headrutRemoteDataService;
    //.pipe(map(data => process(this.data, this.gridState)));
    
    this.view.subscribe(r => {
      this.formGroups= new FormGroup({ items: new FormArray([])});
      if (r != null) {


        r.data.forEach(i => {
        
          //this.dropDownData.push(i.ProductName);
          /*const formGroup = new FormGroup({
            'ProductID': new FormControl(i.ProductID),
            'ProductName': new FormControl(i.ProductName),
            'UnitPrice': new FormControl(i.UnitPrice),
            'Discontinued': new FormControl(i.Discontinued),
            'UnitsInStock': new FormControl(i.UnitsInStock)
          });*/
          let formGroup = this.formBuilder.group({
            't_sibat_headr_ed_mef': (i.t_sibat_headr_ed_mef==null)?'':i.t_sibat_headr_ed_mef,
            'id_sug_headrut': i.id_sug_headrut
          });
          (<FormArray>local.formGroups.controls['items']).push(formGroup);
        });
      }
    });

    this.dictSrv.getData<any>("sibot_headrut").subscribe(result=>{
      let sibot_headrut =result;  
      this.sibot_headruyot.push({ label: '', value: -1 });
      for (var i = 0; sibot_headrut.length > i; i++) {
        this.sibot_headruyot.push({ label: sibot_headrut[i].text, value: sibot_headrut[i].value });
      }
    });


  }


  public onSibatHeadrutChange(e,dataItem:INochechut) {
    dataItem.id_sug_headrut=e;
    this.OnSaveHeadrut(dataItem);
    //this.editedNochechut.id_sug_headrut = Number(e);
  }
  private closeEditor(grid, rowIndex = this.editedRowIndex) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    this.editedNochechut = undefined;
  }
  public editHandler({ sender, rowIndex, dataItem }) {

    this.editedRowIndex = rowIndex;

    this.editedNochechut = Object.assign({}, dataItem);

  }

  public saveHandler({ sender, rowIndex, dataItem, isNew }) {
    let data = dataItem as INochechut;
    this.OnSaveHeadrut(this.editedNochechut);

    sender.closeRow(rowIndex);
  }
  public sliderChange(pageIndex: number): void {
    this.skip = (pageIndex - 1) * this.pageSize;
  }

  public onPageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.RefreshData();
  }
  OnSaveHeadrut(dataItem: INochechut) {

    this.nochechutSrv.SaveHeadrut(this.userData.TaarichSidur, this.userData.TaarichSidur,
      dataItem.k_user, this.userData.IdYechidaMevatzat,"", dataItem.id_sug_headrut).subscribe(rows => {

        this.messageService.add({ key: 'success', severity: 'success', life: 2000, detail: 'שמירה בוצע בהצלחה' });
        this.headrutRemoteDataService.refresh();
        this.RefreshData();
      }, error => {
        if (error.status!=412)
          this.messageService.add({ key: 'success', severity: 'error', life: 2000, detail: error.message });

      });
  }
  public OnPrevDateClick() {
    this.taarichSidur = new Date(moment(this.taarichSidur).add(-1, 'day').format("MM/DD/YYYY"));
    this.userData.TaarichSidur=this.taarichSidur;
    this.headrutRemoteDataService.refresh();
    //this.RefreshData();
  }
  public OnNextDateClick() {
    this.taarichSidur = new Date(moment(this.taarichSidur).add(1, 'day').format("MM/DD/YYYY"));
    this.userData.TaarichSidur=this.taarichSidur;
    this.headrutRemoteDataService.refresh();
    //this.RefreshData();
  }
  onChangeHeadrut(dataItem: INochechut) {
    //alert(dataItem.id_sug_headrut);
  }
  public dtChange(value: Date) {
    this.userData.TaarichSidur = this.taarichSidur;
    this.headrutRemoteDataService.refresh();
    //this.RefreshData();
  }
  RefreshData() {
    setTimeout(() => this.loading = true, 0);

    this.nochechutSrv.GetNochechutOvim(this.skip, this.pageSize, this.userData.TaarichSidur, this.userData.IdYechidaMevatzat)
      .subscribe(result => {
        this.lstNochechut = result.Data;
        this.totalRecords = result.TotalPage;

        /*this.gridView = {
          data: result.Data,
          total: result.TotalPage
      };
*/
        setTimeout(() => this.loading = false, 0);
        $("p-paginator").wrap("<div class='ui-rtl' dir='ltr'></div>");
      });
  }

  OpenHeadrutOved(dataItem: INochechut) {
    this.router.navigate(["/nochechutoved", dataItem.k_user]);
    //this.RefreshNochechutOved(0);
  }

  loadHeadrutLazy(event: LazyLoadEvent) {

    this.skip = event.first;
    setTimeout(() => this.loading = true, 0);
    this.nochechutSrv.GetNochechutOvim(this.skip, this.pageSize, this.userData.TaarichSidur, this.userData.IdYechidaMevatzat)
      .subscribe(result => {
        this.lstNochechut = result.Data;
        this.totalRecords = result.TotalPage;
        setTimeout(() => this.loading = false, 0);
        $("p-paginator").wrap("<div class='ui-rtl' dir='ltr'></div>");
      });
  }
  OnYechidaMevazaatChanged({ yechidaData, action }) {
    let row = yechidaData as IYechidaIrgunit;
    this.userData.KodYechidaMevatzat = Number(row.kod_yechida);
    this.userData.IdYechidaMevatzat = row.id_yechida;
    //this.RefreshData();
    if (action != 'init') {
      this.headrutRemoteDataService.refresh();//.query({ skip: 0, take: 12 });
    }
  }
  public createFormGroup(args: any): any {
    let item: INochechut = args.dataItem;
    this.formGroup = this.formBuilder.group({
      't_sibat_headr_ed_mef': item.t_sibat_headr_ed_mef,
      'id_sug_headrut': item.id_sug_headrut
    });

    return this.formGroup;

  }
  OnCloseYechidaMevazaat(row: IYechidaIrgunit) {

    if (row != 'empty') {
      this.userData.KodYechidaMevatzat = Number(row.kod_yechida);
      this.userData.IdYechidaMevatzat = row.id_yechida;
      //this.RefreshData();
      this.headrutRemoteDataService.refresh();
    }

  }
}
