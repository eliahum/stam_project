import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ISibatHeadrut, SidurAvodaService, ComboItem, INochechut } from '../../index';
import { DictionaryService } from '../../shared/services/dictionary.service';

@Component({
  selector: 'dropdown-for-table',
  templateUrl: 'dropdown-for-table.component.html',
  styleUrls: ['dropdown-for-table.component.scss']
})
export class DropdownForTableComponent implements OnInit {
  @Output()
  onChangeHeadrut: EventEmitter<INochechut> = new EventEmitter();
  public myval:number=2;
  @Input()
  public isaddempty:boolean;
  @Input()
  public Id: number = -1;
  @Input("nochechut")
  public currentNochechut:INochechut;
  public selectedItem: ComboItem =  { text: '', value: 2 };
  public listItems: ComboItem[] = [

  ];
  public items: ComboItem[] = [
    
      ];
  constructor(private srv: SidurAvodaService,
    private dictSrv: DictionaryService) { }

  ngOnInit() {

    this.dictSrv.getData<any>("sibot_headrut").subscribe(result=>{

      Object.assign(this.items, result);
      if (this.isaddempty){
        this.items.unshift({text:'',value:-1});
      }
      this.listItems=this.items;
    });

    this.selectedItem.value=this.Id
    
    
  }
  onChange(value:any){
    this.currentNochechut.id_sug_headrut=value.value;
    this.onChangeHeadrut.emit(this.currentNochechut);
  }


}
