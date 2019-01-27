import { Component, OnInit, Output, EventEmitter, ViewChild, TemplateRef, Input, ChangeDetectorRef, forwardRef } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MesimaService, ISugMesima, Filter } from '../../index';
import { LazyLoadEvent, FilterMetadata } from 'primeng/api';
import * as $ from "jquery";
import { MessageService } from 'primeng/api';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor, Validator, FormControl } from '@angular/forms';

@Component({
  selector: 'sug-mesima-ng',
  templateUrl: 'sug-mesima-ng.component.html',
  styleUrls: ['sug-mesima-ng.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SugMesimaNgComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => SugMesimaNgComponent),
      multi: true,
    }]
})

export class SugMesimaNgComponent implements OnInit, ControlValueAccessor, Validator {

  @ViewChild('contentSugMesimaNg')
  modalTemplate: TemplateRef<any>;
  private _modalSugMesimaRef: NgbModalRef;
  @Output()
  onCloseComp: EventEmitter<any> = new EventEmitter();
  @Output()
  onKodChanged: EventEmitter<any> = new EventEmitter();
  kod_sug: string;
  teur_sug: string;
  old_kod_sug: string;
  old_teur_sug: string;
  @Input()
  kodSugDefault: string;
  @Input()
  isMessageIfEmpty;
  // @Input()
  // withPermission: boolean = false;
  @Input()
  parentRow: any;
  @Input()
  widthTeur: string = "130";


  @Input()
  pageSize: number;
  @Input()
  title: string;
  totalRecords: number = 0;
  lstSugeyMesima: ISugMesima[];
  loading: boolean = false;
  cols: any[];
  skip: number = 0;


  private data: any;
  private parseError: boolean= false;

  constructor(private modalService: NgbModal, private srv: MesimaService,
    private messageService: MessageService) {}

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
  }
  registerOnValidatorChange?(fn: () => void): void {
  }
  public validate(c: FormControl) {
    return (!this.parseError) ? null : {
      jsonParseError: {
        valid: false,
      },
    };
  }
  ClickSugMesima(data: any) {
    this.open();
  }
  open() {
    this._modalSugMesimaRef = this.modalService.open(this.modalTemplate);
    this._modalSugMesimaRef.result.then((result) => {
      if (
        result != "empty") {
        this.kod_sug = (result as ISugMesima).kod_sug;
        this.teur_sug = (result as ISugMesima).teur_sug;
      }
      this.parseError=false;
      this.data=this.kod_sug;
      this.propagateChange(this.data);
      this.onCloseComp.emit(result);
    }, (reason) => {
      alert('Dismissed');
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
    this.data=this.kod_sug;
    this.propagateChange(this.data);
    this.onKodChanged.emit({ sugMesimaData: event, action: 'selected', parentrow: this.parentRow });
    this._modalSugMesimaRef.close(event);
  }
  loadSugeyMesimaLazy(event: LazyLoadEvent) {
    let filters: Filter[] = this.GetFilters(event);
    setTimeout(() => this.loading = true, 0)
    let sortField = (event.sortField != undefined) ? event.sortField : '';
    let sortOrder = event.sortOrder ? event.sortOrder : null;
    this.skip = event.first;
    this.srv.getSugeyMesima(this.skip, this.pageSize, filters, sortOrder, sortField).
      subscribe(sugeyMesima => {
        setTimeout(() => this.loading = false, 0)
        this.lstSugeyMesima = sugeyMesima.Data;
        this.totalRecords = sugeyMesima.TotalPage;
      },
        error => console.log(error),
      );
  }
  ngOnInit() {
    this.cols = [
      { field: 'kod_sug', header: 'קוד יחידה' },
      { field: 'teur_sug', header: 'תיאור יחידה' }
    ];
    $("p-paginator").wrap("<div class='ui-rtl' dir='ltr'></div>");

    if (this.kodSugDefault != "" && this.kodSugDefault != undefined) {
      this.kod_sug = this.kodSugDefault;
      this.onSugMesimaBlur(null, 'init');
    }
  }
  onSugMesimaBlur(data: any, action: string = '') {

    let curObj = this;
    let filters: Filter[] = [];
    if (this.kod_sug != undefined && this.kod_sug != "") {

      filters.push(new Filter("kod_sug", this.kod_sug));
      this.srv.getSugeyMesima( 0, 1000, filters, null, '').
        subscribe(sugeyMesima => {
          if (sugeyMesima.TotalPage == 1) {
            this.teur_sug = sugeyMesima.Data[0].teur_sug;
            this.old_kod_sug = sugeyMesima.Data[0].kod_sug;
            this.old_teur_sug = this.teur_sug;
            this.parseError=false;
            this.data=this.kod_sug;
            this.propagateChange(this.data);
            this.onKodChanged.emit({ sugMesimaData: sugeyMesima.Data[0], action: action, parentrow: this.parentRow });
          }
          else {
            curObj.teur_sug = "";
            curObj.kod_sug = "";
            if (curObj.isMessageIfEmpty == 'true') {
              this.kod_sug = this.old_kod_sug;

              this.teur_sug = this.old_teur_sug;
              this.messageService.add({ key: 'success', severity: 'error', life: 1300, detail: 'אין אפשרות להציג יחידה' });
              
              this.parseError=true;
              this.data=this.kod_sug;
              this.propagateChange(this.data);
            }
            else {
              this.parseError=true;
              this.data=this.kod_sug;
              this.propagateChange(this.data);
              this.onKodChanged.emit({ sugMesimaData: { kod_sug: null, teur_sug: null }, action: action, parentrow: this.parentRow });
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
        this.kod_sug = this.old_kod_sug;
        this.teur_sug = this.old_teur_sug;
        this.messageService.add({ key: 'success', severity: 'error', life: 1300, detail: 'שדה ' + this.title + ' חובה' });

      }
      else {
        this.teur_sug = "";
        this.parseError=true;
        this.data=this.kod_sug;
        this.propagateChange(this.data);
        this.onKodChanged.emit({ sugMesimaData:  { kod_sug: null, teur_sug: null }, action: action, parentrow: this.parentRow });
      }
    }

  }

}
