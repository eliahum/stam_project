import { Component, OnInit, ViewChild, TemplateRef, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { LazyLoadEvent, Column, DataTable, Paginator, FilterMetadata } from 'primeng/primeng';
import * as $ from "jquery";
import { ITemplate, SidurAvodaService } from '../../index';

import { IntlService } from '@progress/kendo-angular-intl';
import { UserDataService } from 'src/app/shared/services/user-data.service';



@Component({
  selector: 'mishtana-ng',
  templateUrl: 'mishtana-ng.component.html',
  styleUrls: ['mishtana-ng.component.scss']
})
export class MishtanaNgComponent implements OnInit {

  public taarichSidur: Date = this.userData.TaarichSidur; //new Date(2018, 5, 3);
  lstMesimot: ITemplate[];
  loading: boolean;
  totalRecords: number;
  selectedMesima: ITemplate;
  _modalTemplateNgRef: NgbModalRef;
  @ViewChild('contentMishtanaNg')
  modalTemplateNg: TemplateRef<any>;
  @Output()
  onCloseComp: EventEmitter<ITemplate> = new EventEmitter();
  constructor(private modalService: NgbModal,
    private srv: SidurAvodaService,
    private userData: UserDataService,
    private intl: IntlService) {
      this.loading=true;
     }
  onOpenDialog() {

    this.open();
  }

  open() {
    this._modalTemplateNgRef = this.modalService.open(this.modalTemplateNg);
    this._modalTemplateNgRef.result.then((result) => {
      this.onCloseComp.emit(result);
      //onCloseComp
      //alert('closed');
      //this.closeResult = `Closed with: ${result}`;
    }, (reason) => {

      alert('Dismissed');
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  ngOnInit() {
    $("p-paginator").wrap("<div class='ui-rtl' dir='ltr'></div>");
    //this.loading=true;
  }
  loadMesimotLazy(event: LazyLoadEvent) {
    //alert(this.intl.formatDate(this.userData.TaarichSidur, 'yyyy-MM-dd'));
    this.loading=true;
    this.srv.getMesimotMishtanot(this.userData.TaarichSidur,this.userData.IdYechidaMevatzat,event.first, event.rows,null).
    subscribe(mesimot => {

      this.lstMesimot = mesimot.Data;
      this.totalRecords = mesimot.TotalPage;

      this.loading=false;
      $("p-paginator").wrap("<div class='ui-rtl' dir='ltr'></div>");
    },
    error => console.log(error)
  );
  }
  onRowSelect(event) {
    this._modalTemplateNgRef.close(event);
  }
}
