import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { SidurAvodaService, ITemplate } from '../../index';

@Component({
  selector: 'hearat-sidur',
  templateUrl: './hearat-sidur.component.html',
  styleUrls: ['./hearat-sidur.component.scss']
})
export class HearatSidurComponent implements OnInit {
  @Input()  
  HearatSidur: string;
  @Output()
  onYesComp: EventEmitter<string> = new EventEmitter();
  display: boolean = false;
  currentPeilut: ITemplate = null;
  constructor(private srv: SidurAvodaService) { }
  showDialog() {
    this.display = true;
  }
  doTextareaValueChange(ev) {
    try {
      this.HearatSidur = ev.target.value;
    } catch (e) {
      console.info('could not set textarea-value');
    }
  }
  ngOnInit() {
  }
  OnDialogYesClick() {
    this.onYesComp.emit(this.HearatSidur);

    this.display = false;
  }
  OnDialogNoClick() {
    this.display = false;

  }
}
