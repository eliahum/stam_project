import { Component, OnInit, Inject } from '@angular/core';

import { DialogData } from '../..';
import { Directionality } from '@angular/cdk/bidi';
import { Subscription } from 'rxjs-compat/Subscription';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/api';



@Component({
  selector: 'app-yes-no-dialog',
  templateUrl: './yes-no-dialog.component.html',
  styleUrls: ['./yes-no-dialog.component.scss']
})
export class YesNoDialogComponent implements OnInit  {
  display: boolean=true;
  

  constructor(
    public ref: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig
) {

  //this.data.answer = "yes";
    
  }

  ngOnInit(): void {
    //this.ref.updateSize('400px','200px');
  }
  onNoClick(): void {
    this.ref.close("no");

    //this.dialogRef.close("no");
  }
  onYesClick(): void {
    this.ref.close("yes");
    //this.data.answer = "yes";
  }
}
