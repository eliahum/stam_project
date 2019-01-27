import { Component, OnInit, Input } from '@angular/core';
import { IPirteiOved } from '../../shared/types/pirtei_oved';

@Component({
  selector: 'pirtei-oved',
  templateUrl: 'pirtei-oved.component.html',
  styleUrls: ['pirtei-oved.component.css']
})
export class PirteiOvedComponent implements OnInit {

  @Input() 
  Oved:IPirteiOved;
  @Input()
  IsCardVisible:boolean=true;
  @Input()
  width:string="1320px";
  constructor() { }

  ngOnInit() {
  }

}
