import { Component, OnInit, ViewChild, TemplateRef, Output, EventEmitter, ElementRef, Input } from '@angular/core';

import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LazyLoadEvent, Column, DataTable, Paginator, FilterMetadata } from 'primeng/primeng';
import * as $ from "jquery";
import { SafeStyle } from '@angular/platform-browser';
import { IOvedPanui, SearchOvedParams, ITemplate, Filter, SidurAvodaService, TikuneiRechevService } from '../../index';
@Component({
  selector: 'oved-ng',
  templateUrl: 'oved-ng.component.html',
  styleUrls: ['oved-ng.component.scss']
})
export class OvedNgComponent implements OnInit {
  RECHEVIM_LO_RAHSAI_RECHEV = "הנהג אינו רשאי לנהוג ברכב זה";
  LOOKUP_TOOLTIP_MESHUBAZ: string = "עובד יצא למשימות : ";
  LOOKUP_TOOLTIP_OVED_MESHURAR: string = "העובד משוחרר מיחידה : ";
  LOOKUP_TOOLTIP_TEMPLATE: string = "עובד משובץ באופן קבוע למשימות : ";
  LOOKUP_TOOLTIP_PANUI: string = "אפשר לשבץ";
  LOOKUP_TOOLTIP_NEHEDAR: string = "עובד נעדר בשל : ";
  RECHEVIM_HAGBALAT_RISHAYON: string = "לנהג יש הגבלת רשיון";

  selectedOved: IOvedPanui;
  searchParams: SearchOvedParams = null;
  loading: boolean;
  cols: any[];
  totalRecords: number;
  lstOvdim: IOvedPanui[];
  @Input()
  TamidEfsharLeshabetz: boolean = false;
  currentSidurRow: ITemplate = null;
  private _modalOvdimPnuimNgRef: NgbModalRef;
  @ViewChild('contentOvedPanuiNg')
  modalTemplateNg: TemplateRef<any>;
  constructor(private modalService: NgbModal,
    private srv: SidurAvodaService,
    private tikunSechevService: TikuneiRechevService,
    private el: ElementRef) { }

  @Output()
  onCloseComp: EventEmitter<any> = new EventEmitter();
  @Input()
  Id: string;
  @Input()
  SugRechev: string;
  @Input()
  Sug: string = "Ovdim";
  ngOnInit() {

    this.cols = [
      { field: 'shem_mishpacha', header: 'משפחה' },
      { field: 'shem_prati', header: 'שם' },
      { field: 'td_zehut_user', header: 'ת.ז' },
      { field: 'mispar_oved', header: 'מספר עובד' },
      { field: 'mispar_nahag', header: 'מספר נהג' }

    ];
    $("p-paginator").wrap("<div class='ui-rtl' dir='ltr'></div>");
    setTimeout(() => this.loading = true, 0)
  }
  onOpenDialog() {

    this.open();
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

    if (this.SugRechev && event.sugRechev.indexOf(',' + this.SugRechev + ',') == -1) {
      return;
    }

    if (event.teurHeadrut.trim() == "" && event.HagbalatRishayon.trim() == "") {

      this._modalOvdimPnuimNgRef.close(event);
    }
    //this.onCloseComp.emit(event);
    //this.msgs = [{severity:'info', summary:'Car Selected', detail:'Vin: ' + event.data.vin}];
  }
  loadOvdimLazy(event: LazyLoadEvent) {
    let filters: Filter[] = this.GetFilters(event);
    //if (filters.length > 0 || event.first>=event.rows ) {
    //      alert(filters.length);

    setTimeout(() => this.loading = true, 0)
    let sortField = (event.sortField != undefined) ? event.sortField : '';
    let sortOrder = event.sortOrder ? event.sortOrder : null;
    if (filters.length == 0) {
      if (this.Sug == 'Ovdim') {
        this.srv.getOvdimPnuim(this.searchParams.dtSidur, this.searchParams.userId,
          this.searchParams.yechidaId, this.searchParams.sugPeilutId,
          this.searchParams.ymim, this.searchParams.sugRechev, event.first, event.rows, filters, sortOrder, sortField).
          subscribe(ovdim => {

            this.lstOvdim = ovdim.Data;
            this.totalRecords = ovdim.TotalPage;
            $("p-paginator").wrap("<div class='ui-rtl' dir='ltr'></div>");
            setTimeout(() => this.loading = false, 0)
          },
            error => console.log(error)
          );
      }
      else {
        this.tikunSechevService.getNehagimMaavirimLeTikum(event.first, event.rows).subscribe(ovdim => {
          this.lstOvdim = ovdim.Data;
          this.totalRecords = ovdim.TotalPage;
          $("p-paginator").wrap("<div class='ui-rtl' dir='ltr'></div>");
          setTimeout(() => this.loading = false, 0)
        },
          error => console.log(error)
        );
      }
    }
    else {
      this.srv.getOvdimPnuim(this.searchParams.dtSidur, this.searchParams.userId,
        this.searchParams.yechidaId, this.searchParams.sugPeilutId,
        this.searchParams.ymim, this.searchParams.sugRechev, event.first, event.rows, filters, sortOrder, sortField).
        subscribe(ovdim => {

          this.lstOvdim = ovdim.Data;
          this.totalRecords = ovdim.TotalPage;
          $("p-paginator").wrap("<div class='ui-rtl' dir='ltr'></div>");
          setTimeout(() => this.loading = false, 0)
        },
          error => console.log(error)
        );
    }

  }
  GetCursorStyle(row: IOvedPanui): SafeStyle {
    let styles = {
      'cursor': 'pointer'
    };
    if (row.teurHeadrut.trim() != "" || row.HagbalatRishayon.trim() != "")
      styles.cursor = 'hand';
    else
      //if (row.IsRechevBetikun == 0) styles.cursor = 'pointer';
      //else styles.cursor = 'hand';
      styles.cursor = 'pointer';
    return styles;
  }
  public SetStyle(row: IOvedPanui): SafeStyle {
    this.ClearRowNulls(row);
    let styles = {
      'color': 'black',
      'font-weight': 'normal',
      'cursor': 'hand'
    };
    if (this.TamidEfsharLeshabetz) {
      styles = {
        'color': 'black',
        'font-weight': 'bold',
        'cursor': 'pointer'
      };
    }
    else {
      if (this.SugRechev && row.sugRechev.indexOf(',' + this.SugRechev + ',') == -1) {
        styles.color = 'red';
        styles["font-weight"] = 'bold';
        styles.cursor = 'hand';
      }
      else {
        if (row.teurHeadrut.trim() == "" && row.HagbalatRishayon.trim() == "") {

          if (row.MesimotMeshubetzot.trim() != "") {
            styles.color = 'blue';
            styles.cursor = 'pointer';
          }
          else if (row.MesimotTemplate.trim() != "") {
            styles.color = 'blue';
            styles.cursor = 'pointer';
          }
          else {
            styles = {
              'color': 'black',
              'font-weight': 'bold',
              'cursor': 'pointer'
            };
          }

        }
        else {
          styles.color = 'red';
          styles.cursor = 'hand';

        }
      }
    }
    return styles;
    //return this.sanitizer.bypassSecurityTrustStyle(result);
  }
  public ClearRowNulls(row: IOvedPanui) {
    if (!row.teurHeadrut) row.teurHeadrut = "";
    if (!row.HagbalatRishayon) row.HagbalatRishayon = "";
    if (!row.MesimotMeshubetzot) row.MesimotMeshubetzot = "";
    if (!row.MesimotTemplate) row.MesimotTemplate = "";
    if (!row.kod_yechida) row.kod_yechida = "";
    if (!row.heara) row.heara = "";
  }
  public GetOvedTooltip(row: IOvedPanui) {
    let result: string = "";
    this.ClearRowNulls(row);
    if (this.TamidEfsharLeshabetz) {
      result = result + this.LOOKUP_TOOLTIP_PANUI;
    }
    else {
      if (this.SugRechev && row.sugRechev.indexOf(',' + this.SugRechev + ',') == -1) {
        result = this.RECHEVIM_LO_RAHSAI_RECHEV
      }
      else {
        if (row.teurHeadrut.trim() == "" && row.HagbalatRishayon.trim() == "") {

          if (row.ovedNiud == 1)
            result = this.LOOKUP_TOOLTIP_OVED_MESHURAR + row.kod_yechida + "<br/>+" + row.heara;

          if (row.MesimotMeshubetzot.trim() != "") {
            if (result != "")
              result = result + ".<br/>" + this.LOOKUP_TOOLTIP_MESHUBAZ + row.MesimotMeshubetzot;
            else
              result = result + this.LOOKUP_TOOLTIP_MESHUBAZ + row.MesimotMeshubetzot;

            if (row.MesimotTemplate.trim() != "")
              result = result + this.LOOKUP_TOOLTIP_TEMPLATE + row.MesimotTemplate + " ";
          }
          else if (row.MesimotTemplate.trim() != "") {
            result = result + this.LOOKUP_TOOLTIP_TEMPLATE + row.MesimotTemplate + " ";
          }
          else {
            result = result + this.LOOKUP_TOOLTIP_PANUI;
          }
        }
        else {
          let teurHagbala: string = '';
          let teurLoRashai: string = '';
          let teurHeadrut: string = row.teurHeadrut.trim();
          if (teurHeadrut != '')
            teurHeadrut = this.LOOKUP_TOOLTIP_NEHEDAR + ' ' + teurHeadrut.trim();

          if (row.HagbalatRishayon.trim() != '')
            teurHagbala = this.RECHEVIM_HAGBALAT_RISHAYON + ' : ' + row.HagbalatRishayon.trim();

          let globalTeur: string = (teurHeadrut == '' ? '' : teurHeadrut + ',');
          globalTeur += (teurHagbala == '' ? '' : teurHagbala);
          globalTeur = globalTeur.substring(0, globalTeur.length - 1);
          result = globalTeur;
        }
      }
    }

    return result;
  }
  GetOvedTmuna(row: IOvedPanui) {
    let result: string = "";
    result = "";
    this.ClearRowNulls(row);
    if (this.SugRechev && row.sugRechev.indexOf(',' + this.SugRechev + ',') == -1) {
      result = "SmallWorkerAway.gif";
    }
    else {
      if (row.teurHeadrut.trim() == "" && row.HagbalatRishayon.trim() == "") {
        if (row.MesimotMeshubetzot.trim() != "") {
          result = "SmallWorkerPlaced.gif";
        }
        else
          result = "SmallWorkerAllowed.gif";
      }
      else
        result = "SmallWorkerAway.gif";
    }

    return result;

  }
  public SetModel(row: any, dtSidur: Date, userId: number, yechidaId: number,
    sugPeilutId: number, ymim: number, sugRechev: number) {
    this.currentSidurRow = row;
    this.searchParams = new SearchOvedParams();

    if (row != undefined) {
      this.searchParams.dtSidur = dtSidur;
      this.searchParams.userId = userId;
      this.searchParams.yechidaId = yechidaId;
      this.searchParams.sugPeilutId = sugPeilutId;
      this.searchParams.ymim = ymim;
      this.searchParams.sugRechev = sugRechev;

    }
  }

  open() {
    this._modalOvdimPnuimNgRef = this.modalService.open(this.modalTemplateNg);
    this._modalOvdimPnuimNgRef.result.then((result) => {
      this.onCloseComp.emit(result);
    }, (reason) => {

      alert('Dismissed');
    });
  }
}
