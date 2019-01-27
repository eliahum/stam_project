import { Component, OnInit, Output, EventEmitter, ViewChild, TemplateRef, Input, ChangeDetectorRef, forwardRef } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { YechidaService, IYechidaIrgunit, Filter } from '../../index';
import { LazyLoadEvent, FilterMetadata } from 'primeng/api';
import * as $ from "jquery";
import { ToastContainerDirective, ToastrService, Toast } from 'ngx-toastr';
import { MessageService } from 'primeng/api';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor, Validator, FormControl } from '@angular/forms';

@Component({
  selector: 'yechida-comp-ng',
  templateUrl: 'yechida-comp-ng.component.html',
  styleUrls: ['yechida-comp-ng.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => YechidaCompNgComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => YechidaCompNgComponent),
      multi: true,
    }]
})

export class YechidaCompNgComponent implements OnInit, ControlValueAccessor, Validator {

  @ViewChild('contentYechidaNg')
  modalTemplate: TemplateRef<any>;
  private _modalYechidaRef: NgbModalRef;
  @Output()
  onCloseComp: EventEmitter<any> = new EventEmitter();
  @Output()
  onKodChanged: EventEmitter<any> = new EventEmitter();
  kod_yechida: string;
  yechida_name: string;
  old_kod_yechida: string;
  old_yechida_name: string;
  @Input()
  kodYechidaDefault: string;
  @Input()
  isMessageIfEmpty;
  @Input()
  withPermission: boolean = false;
  @Input()
  parentRow: any;

  @Input()
  widthTeur: string = "130";


  @Input()
  pageSize: number;
  @Input()
  title: string;
  totalRecords: number = 0;
  lstYechidot: IYechidaIrgunit[];
  loading: boolean = false;
  cols: any[];
  skip: number = 0;


  private data: any;
  private parseError: boolean= false;

  constructor(private modalService: NgbModal, private srv: YechidaService,
    private toastr: ToastrService, private messageService: MessageService,
    private detect :ChangeDetectorRef
    ) {


  }

  writeValue(obj: any): void {
    
    if (obj) {
      this.data = obj;
    }
  }
  // registers 'fn' that will be fired wheb changes are made
  // this is how we emit the changes back to the form
  public registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }
  // the method set in registerOnChange to emit changes back to the form
  private propagateChange = (_: any) => { };

  // not used, used for touch input
  public registerOnTouched() { }
  setDisabledState?(isDisabled: boolean): void {
    //throw new Error("Method not implemented.");
  }
  registerOnValidatorChange?(fn: () => void): void {
    
    //throw new Error("Method not implemented.");
  }
  public validate(c: FormControl) {
    return (!this.parseError) ? null : {
      jsonParseError: {
        valid: false,
      },
    };
    /*return {
      jsonParseError: {
        valid: false,
      }
    };*/
  }
  /*// change events from the textarea
  private onChange(event) {
    // get value from text area
    let newValue = event.target.value;

    try {
      // parse it to json
      if (this.kod_yechida == undefined || this.kod_yechida == "")
        this.parseError = true;
      else
        this.parseError = false;

    } catch (ex) {
      // set parse error if it fails
      this.parseError = true;
    }

    // update the form
    this.propagateChange(this.data);
  }*/
  ClickYechida(data: any) {
    this.open();
  }
  open() {
    this._modalYechidaRef = this.modalService.open(this.modalTemplate);
    this._modalYechidaRef.result.then((result) => {
      if (//this.isMessageIfEmpty != 'true' && 
        result != "empty") {
        this.kod_yechida = (result as IYechidaIrgunit).kod_yechida;
        this.yechida_name = (result as IYechidaIrgunit).yechida;
      }
      this.parseError=false;
      this.data=this.kod_yechida;
      this.propagateChange(this.data);
      this.onCloseComp.emit(result);
      //onCloseComp
      //alert('closed');
      //this.closeResult = `Closed with: ${result}`;
    }, (reason) => {

      alert('Dismissed');
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
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
  onRowSelect(event) {
    this.parseError=false;
    this.data=this.kod_yechida;
    this.propagateChange(this.data);
    this.onKodChanged.emit({ yechidaData: event, action: 'selected', parentrow: this.parentRow });
    this._modalYechidaRef.close(event);
  }
  loadYechidotLazy(event: LazyLoadEvent) {
    let filters: Filter[] = this.GetFilters(event);
    setTimeout(() => this.loading = true, 0)
    let sortField = (event.sortField != undefined) ? event.sortField : '';
    let sortOrder = event.sortOrder ? event.sortOrder : null;
    this.skip = event.first;
    this.srv.getYechidot(this.withPermission, this.skip, this.pageSize, filters, sortOrder, sortField).
      subscribe(yechidot => {
        setTimeout(() => this.loading = false, 0)
        this.lstYechidot = yechidot.Data;
        this.totalRecords = yechidot.TotalPage;

      },
        error => console.log(error),
      );

  }
  ngOnInit() {
    this.cols = [
      { field: 'kod_yechida', header: 'קוד יחידה' },
      { field: 'yechida', header: 'תיאור יחידה' },
      { field: 'yechidat_av_code', header: 'קוד יחידת אב' },
      { field: 'yechidat_av_teur', header: 'תיאור יחידת אב' }

    ];
    $("p-paginator").wrap("<div class='ui-rtl' dir='ltr'></div>");

    if (this.kodYechidaDefault != "" && this.kodYechidaDefault != undefined) {
      this.kod_yechida = this.kodYechidaDefault;
      this.onYechidaBlur(null, 'init');
    }
  }
  onYechidaBlur(data: any, action: string = '') {

    let curObj = this;
    let filters: Filter[] = [];
    if (this.kod_yechida != undefined && this.kod_yechida != "") {

      filters.push(new Filter("kod_yechida", this.kod_yechida));
      //this.old_kod_yechida = this.kod_yechida;
      //this.old_yechida_name = this.yechida_name;
      this.srv.getYechidot(this.withPermission, 0, 1000, filters, null, '').
        subscribe(yechidot => {
          if (yechidot.TotalPage == 1) {
            this.yechida_name = yechidot.Data[0].yechida;
            this.old_kod_yechida = yechidot.Data[0].kod_yechida;
            this.old_yechida_name = this.yechida_name;
            this.parseError=false;
            this.data=this.kod_yechida;
            this.propagateChange(this.data);
            this.onKodChanged.emit({ yechidaData: yechidot.Data[0], action: action, parentrow: this.parentRow });
          }
          else {
            curObj.yechida_name = "";
            curObj.kod_yechida = "";
            if (curObj.isMessageIfEmpty == 'true') {
              this.kod_yechida = this.old_kod_yechida;

              this.yechida_name = this.old_yechida_name;
              this.messageService.add({ key: 'success', severity: 'error', life: 1300, detail: 'אין אפשרות להציג יחידה' });
              
              this.parseError=true;
              this.data=this.kod_yechida;
              this.propagateChange(this.data);
            }
            else {
              this.parseError=true;
              this.data=this.kod_yechida;
              this.propagateChange(this.data);
              this.onKodChanged.emit({ yechidaData: { kod_yechida: null, id_yechida: null }, action: action, parentrow: this.parentRow });
            }
          }
        },
          error => console.log(error)
        );
    }
    else {
      if (curObj.isMessageIfEmpty == 'true') {
        this.parseError=false;
        this.propagateChange(this.data);
        this.kod_yechida = this.old_kod_yechida;
        this.yechida_name = this.old_yechida_name;
        this.messageService.add({ key: 'success', severity: 'error', life: 1300, detail: 'שדה ' + this.title + ' חובה' });

      }
      else {
        this.yechida_name = "";
        this.parseError=true;
        this.data=this.kod_yechida;
        this.propagateChange(this.data);
        this.onKodChanged.emit({ yechidaData:  { kod_yechida: null, id_yechida: null }, action: action, parentrow: this.parentRow });
      }
    }

  }

}
