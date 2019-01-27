import { Component, OnInit, ViewChild, TemplateRef, Output, EventEmitter, ElementRef, Input } from '@angular/core';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as $ from "jquery";
import { LazyLoadEvent, Column, DataTable, Paginator, FilterMetadata } from 'primeng/primeng';
import { SafeStyle } from '@angular/platform-browser';
import { IRechevPanui, SearchRechevParams, ITemplate, SidurAvodaService, Filter, TikuneiRechevService } from '../../index';
import { RechevService } from '../../shared/services/rechev.service';
@Component({
  selector: 'rechev-ng',
  templateUrl: 'rechev-ng.component.html',
  styleUrls: ['rechev-ng.component.scss']
})
export class RechevNgComponent implements OnInit {
  LOOKUP_TOOLTIP_MOSACH: string = "רכב במוסך";
  LOOKUP_TOOLTIP_MESHUBAZ_RECHEV: string = "רכב יצא למשימות : ";
  LOOKUP_TOOLTIP_RECHEV_TEMPLATE: string = "רכב משובץ באופן קבוע למשימות ";
  LOOKUP_TOOLTIP_PANUI: string = "אפשר לשבץ";
  selectedRechev: IRechevPanui;
  searchParams: SearchRechevParams = null;
  loading: boolean;
  cols: any[];
  totalRecords: number;
  lstRechavim: IRechevPanui[];
  currentSidurRow: ITemplate = null;
  private _modalRechavimPnuimNgRef: NgbModalRef;
  @ViewChild('contentRechevPanuiNg')
  modalTemplateNg: TemplateRef<any>;

  @Input()
  IsRechavimPnuim: boolean = true;



  constructor(private modalService: NgbModal,
    private rechevService: RechevService,
    private tikunRechevSrv: TikuneiRechevService,
    private srv: SidurAvodaService, private el: ElementRef) { }

  @Output()
  onCloseComp: EventEmitter<IRechevPanui> = new EventEmitter();


  ngOnInit() {
    this.cols = [
      { field: 'mispar_pnimi', header: 'פנימי' },
      { field: 'mispar_rishui_netzer', header: 'מ.רישוי' },
      { field: 'teur_sug_rechev', header: 'סוג רכב' },
      { field: 'teur_sug_rechev_netzer', header: 'נצר' },
      { field: 'teur_sug_nefech_rehev', header: 'התקן' }

    ];
    $("p-paginator").wrap("<div class='ui-rtl' dir='ltr'></div>");
    setTimeout(() => this.loading = true, 0);
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
    let isRechevBetikun = event.IsRechevBetikun != null ? event.IsRechevBetikun : 0;

    if (isRechevBetikun == 0) {
      this._modalRechavimPnuimNgRef.close(event);
    }
    //this.onCloseComp.emit(event);
    //this.msgs = [{severity:'info', summary:'Car Selected', detail:'Vin: ' + event.data.vin}];
  }
  loadRechavimLazy(event: LazyLoadEvent) {
    let filters: Filter[] = this.GetFilters(event);


    setTimeout(() => this.loading = true, 0)
    let sortField = (event.sortField != undefined) ? event.sortField : '';
    let sortOrder = event.sortOrder ? event.sortOrder : null;
    if (filters.length == 0) {
      if (this.IsRechavimPnuim) {
        this.srv.getRechavimPnuim(this.searchParams.dtSidur, this.searchParams.sugRechev,
          this.searchParams.misparpnimi, this.searchParams.ymim, event.first, event.rows,
          null, this.searchParams.nefachHetken, this.searchParams.yecholet_maavar,
          sortOrder, sortField).
          subscribe(rechavim => {

            this.lstRechavim = rechavim.Data;
            this.totalRecords = rechavim.TotalPage;
            $("p-paginator").wrap("<div class='ui-rtl' dir='ltr'></div>");
            setTimeout(() => this.loading = false, 0)
          },
            error => console.log(error),
          );
      }
      else {
        this.rechevService.GetRechavimPeilim(event.first, event.rows, filters, sortOrder, sortField).
          subscribe(rechavim => {
            this.lstRechavim = rechavim.Data;
            this.totalRecords = rechavim.TotalPage;
            $("p-paginator").wrap("<div class='ui-rtl' dir='ltr'></div>");
            setTimeout(() => this.loading = false, 0)
          },
            error => console.log(error),
          );


      }
    }
    else {
      if (this.IsRechavimPnuim) {
        this.srv.getRechavimPnuim(this.searchParams.dtSidur, this.searchParams.sugRechev,
          this.searchParams.misparpnimi, this.searchParams.ymim, event.first, event.rows,
          filters,
          this.searchParams.nefachHetken, null, sortOrder, sortField).
          subscribe(rechavim => {

            this.lstRechavim = rechavim.Data;
            this.totalRecords = rechavim.TotalPage;
            $("p-paginator").wrap("<div class='ui-rtl' dir='ltr'></div>");
            setTimeout(() => this.loading = false, 0)
          },
            error => console.log(error),
          );
      }
      else {
        this.rechevService.GetRechavimPeilim(event.first, event.rows, filters, sortOrder, sortField).
        subscribe(rechavim => {
          this.lstRechavim = rechavim.Data;
          this.totalRecords = rechavim.TotalPage;
          $("p-paginator").wrap("<div class='ui-rtl' dir='ltr'></div>");
          setTimeout(() => this.loading = false, 0)
        },
          error => console.log(error),
        );


      }
    }

  }
  GetCursorStyle(row: IRechevPanui): SafeStyle {
    let styles = {
      'cursor': 'pointer'
    };
    if (row.IsRechevBetikun == 0) styles.cursor = 'pointer';
    else styles.cursor = 'hand';

    return styles;
  }
  public SetStyle(row: IRechevPanui): SafeStyle {
    this.ClearRowNulls(row);
    let styles = {
      'color': 'black',
      'font-weight': 'bold',
      'cursor': 'pointer'
    };
    let goremMetapel = row.teur_gorem_metaken;
    if (row.IsRechevBetikun != 0) {
      styles.color = 'red';
      styles.cursor = 'hand';

    }
    else {
      if (row.MesimotMeshubetzot.trim() != '') {
        if (row.MesimotTemplate.trim() != '') {
          styles.color = 'blue';
          styles.cursor = 'pointer';
        }
      }
      else if (row.MesimotTemplate.trim() != '') {
        styles.color = 'blue';
        styles.cursor = 'pointer';
      }
      else {

      }
    }
    return styles;
    //return this.sanitizer.bypassSecurityTrustStyle(result);
  }
  public ClearRowNulls(row: IRechevPanui) {

    if (!row.heara) row.heara = "";
    if (!row.MesimotMeshubetzot) row.MesimotMeshubetzot = "";
    if (!row.MesimotTemplate) row.MesimotTemplate = "";
    if (!row.teur_gorem_metaken) row.teur_gorem_metaken = "";
    if (!row.heara) row.heara = "";
  }

  public GetRechevTooltip(row: IRechevPanui) {
    let result: string = "";
    this.ClearRowNulls(row);
    let goremMetapel = row.teur_gorem_metaken;
    if (row.IsRechevBetikun != 0) {
      result = this.LOOKUP_TOOLTIP_MOSACH + ' ' + goremMetapel + ' ' + row.heara;
    }
    else {
      if (row.MesimotMeshubetzot.trim() != '') {
        result = this.LOOKUP_TOOLTIP_MESHUBAZ_RECHEV + row.MesimotMeshubetzot + ' ';
        if (row.MesimotTemplate.trim() != '') {
          result = result + this.LOOKUP_TOOLTIP_RECHEV_TEMPLATE + row.MesimotTemplate + ' ';
        }
      }
      else if (row.MesimotTemplate.trim() != '') {
        result = result + this.LOOKUP_TOOLTIP_RECHEV_TEMPLATE + row.MesimotTemplate + ' ';
      }
      else {
        result = this.LOOKUP_TOOLTIP_PANUI;
      }
    }
    return result.replace('"', '');
  }

  GetRechevTmuna(row: IRechevPanui) {
    let result: string = "";
    if (row != undefined) {
      result = "";
      this.ClearRowNulls(row);
      let IsRechevBeTikun = row.IsRechevBetikun;
      if (IsRechevBeTikun != 0) {
        result = "SmallCarBroke.gif"
      }
      else {
        result = "SmallCarAllowed.gif";
        if (row.MesimotMeshubetzot.trim() != '') {
          result = "SmallCarPlaced.gif";
        }
      }

    }
    return result;

  }
  public SetModel(row: any, dtSidur: Date, sugRechev: number, misparpnimi: string,
    ymim: number, nefachHetken?: number, yecholet_maavar?: number) {
    this.currentSidurRow = row;
    this.searchParams = new SearchRechevParams();

    if (row != undefined) {
      this.searchParams.dtSidur = dtSidur;
      this.searchParams.sugRechev = sugRechev;
      this.searchParams.misparpnimi = misparpnimi;
      this.searchParams.ymim = ymim;
      this.searchParams.nefachHetken = nefachHetken;
      this.searchParams.yecholet_maavar = yecholet_maavar;
      let peilut = row as ITemplate;
      /*  this.srv.getRechavimPnuim(dtSidur, sugRechev, misparpnimi, ymim, 0, 500, '', null, nefachHetken,null,null,'').
          subscribe(rechavim => {
  
            this.lstRechavim = rechavim.Data;
            this.totalRecords = rechavim.TotalPage;
            
            this.loading = false;
          },
          error => console.log(error),
        );*/
    }
  }

  open() {
    this._modalRechavimPnuimNgRef = this.modalService.open(this.modalTemplateNg);
    this._modalRechavimPnuimNgRef.result.then((result) => {
      this.onCloseComp.emit(result);
      //onCloseComp
      //alert('closed');
      //this.closeResult = `Closed with: ${result}`;
    }, (reason) => {

      alert('Dismissed');
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

}
