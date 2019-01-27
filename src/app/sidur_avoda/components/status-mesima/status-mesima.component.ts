import { Component, OnInit, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import { ComboItem, IStatusMesima, Sug_Mahut, YachidaIrgunitCode, SugYechida, ITemplate, ButzaStatus } from '../../index';
import { DictionaryService } from '../../shared/services/dictionary.service';
import { UserDataService } from 'src/app/shared/services/user-data.service';



@Component({
  selector: 'status-mesima',
  templateUrl: 'status-mesima.component.html',
  styleUrls: ['status-mesima.component.scss']
})
export class StatusMesimaComponent implements OnInit {

  @Output()
  onChangeStatus: EventEmitter<ITemplate> = new EventEmitter();

  public disabledStatus: boolean = false;
  @Input()
  public CurrentPeilut: ITemplate = null;
  @Input()
  public IsReadOnly: boolean = false;
  @Input()
  public IdStatusMesima: number = -1;
  @Input()
  public StatusMesimaTeur: string = '';

  @Input()
  public SugMahutId: number = -1;

  public Sug: number;



  public display: string = 'none';


  public listItems: ComboItem[] = [

  ];

  public selectedItem: ComboItem = null;

  constructor(
    private dictSrv: DictionaryService,
    private userData: UserDataService) { }
  public AddStatus(item: IStatusMesima) {
    var p = { text: item.teur_status_mesima, value: item.id_status_mesima };
    this.listItems.push(p);
  }
  ngOnInit() {

    this.dictSrv.getData<any>("status_mesima").subscribe(result => {
      let status_mesima = result;
      let sugYechida: number;
      let data: IStatusMesima[];
      let isHaavara = false;


      let peilutPoel = false;
      switch (this.SugMahutId) {
        case Sug_Mahut.SUG_MAHUT_HAAVARA:
          sugYechida = SugYechida.Hanion;
          isHaavara = true;
          peilutPoel = false;
          break;

        case Sug_Mahut.SUG_MAHUT_PINUI:
          sugYechida = SugYechida.Tahana;
          isHaavara = false;
          peilutPoel = false;
          break;

        default:
          isHaavara = true;
          peilutPoel = true;
          if (this.userData.KodYechidaMevatzat != YachidaIrgunitCode.Hanion)
            sugYechida = SugYechida.Tahana;

          else
            sugYechida = SugYechida.Hanion;
          break;

      }
      this.Sug = sugYechida;

      data = status_mesima.filter(function (x) {
        return x.id_sug_yechida == sugYechida
      });
      let dataEmpty: IStatusMesima[];
      if (this.SugMahutId != Sug_Mahut.SUG_MAHUT_PINUI) {
        dataEmpty = status_mesima.filter(function (x) {
          return x.id_status_mesima == 9
        });
        data.splice(0, 0, { id_status_mesima: 9, teur_status_mesima: '' });

      }
      this.display = isHaavara ? "block" : "none";


      (data as IStatusMesima[]).map(item => this.AddStatus(item));
      if (this.listItems.findIndex(x => x.value == this.IdStatusMesima) != -1) {
        this.selectedItem = this.listItems.find(x => x.value == this.IdStatusMesima)
      }
      else {
        let insertIndex = 0;
        if (this.SugMahutId != Sug_Mahut.SUG_MAHUT_PINUI)
          insertIndex = 1;
        this.listItems.push({ text: this.StatusMesimaTeur, value: this.IdStatusMesima });
        this.selectedItem = this.listItems.find(x => x.value == this.IdStatusMesima);
      }

      let statusMesima = this.CurrentPeilut.id_status_mesima != null ? this.CurrentPeilut.id_status_mesima : ButzaStatus.LOButza;

      let isOvedMeshubatz = this.CurrentPeilut.full_name != null ? true : false;
      let isPeilutButza = statusMesima != ButzaStatus.LOButza;
      let isSiumHanyon = statusMesima == ButzaStatus.SiemBeHanuyon;
      let isRechevMeshubatz = (this.CurrentPeilut.mispar_rishui_netzer != '' ? true : false && this.SugMahutId == Sug_Mahut.SUG_MAHUT_HAAVARA) || (this.SugMahutId != Sug_Mahut.SUG_MAHUT_HAAVARA);
      //display
      if (isPeilutButza) {
        if (isHaavara) {
        }
        else {
          if (isSiumHanyon) {
            this.display = "none";
          }
          else {
            this.display = "block";
          }
        }
      }
      else {
        if (!isOvedMeshubatz) {
          this.disabledStatus = true;
        }

        if (!isRechevMeshubatz && !peilutPoel) {
          this.disabledStatus = true;
        }
      }


    });

  }
  onChange(value: any) {
    this.CurrentPeilut.id_status_mesima = this.selectedItem.value;
    this.onChangeStatus.emit(this.CurrentPeilut);
  }
  ngOnChanges(changes: SimpleChanges) {
    /*for (let property in changes) {

      console.log('Previous:', changes[property].previousValue);
      console.log('Current:', changes[property].currentValue);
    }*/
  }

}
