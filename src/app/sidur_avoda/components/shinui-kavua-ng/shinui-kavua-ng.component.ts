import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ITemplate, SidurAvodaService, IPeilutNidreshet, MesimaService } from '../../index';

@Component({
  selector: 'shinui-kavua-ng',
  templateUrl: './shinui-kavua-ng.component.html',
  styleUrls: ['./shinui-kavua-ng.component.scss']
})
export class ShinuiKavuaNgComponent implements OnInit {
  display: boolean = false;
  currentPeilut: ITemplate = null;
  peilutNidreshet: IPeilutNidreshet = null;
  public sederNochechi?: string;
  public misparNochechi?: string;
  public ovedNochechi?:string;
  @Output()
  onYesComp: EventEmitter<ITemplate> = new EventEmitter();

  constructor(private srv: SidurAvodaService) { }
  showDialog() {
    this.display = true;
    this.sederNochechi = "";
    this.misparNochechi = "";
    this.srv.getPeilutNidreshet(this.currentPeilut.kod_mesima, this.currentPeilut.id_peilut_nidreshet)
      .subscribe(result => {
        
        this.peilutNidreshet = result;
        this.sederNochechi = this.peilutNidreshet.seder_peula;
        this.misparNochechi = this.peilutNidreshet.mispar_pnimi;
        this.ovedNochechi=this.peilutNidreshet.shem_mishpacha+this.peilutNidreshet.shem_prati;
      });
  }
  ngOnInit() {
  }
  OnDialogYesClick() {
    this.onYesComp.emit(this.currentPeilut);
   
    this.display = false;
  }
  OnDialogNoClick() {
    this.display = false;

  }
}
