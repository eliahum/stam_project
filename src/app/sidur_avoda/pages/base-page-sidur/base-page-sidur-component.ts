import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DayOfWeek, Yamim } from '../..';



@Component({
  selector: 'my-base',
  template: `
      <div>
        Am I the base component: {{isBase}}?
      </div>
    `
})
export class BasePageSidurComponent implements OnInit {
  harshaa: number = 0;
  screenDisabled: boolean = false;
  onlySpecipicYechida: boolean = true;
  constructor(protected activatedRoute: ActivatedRoute) { 
  

  }
  ngOnInit(): void {
    this.activatedRoute.data.forEach((data: { harshaa: any }) => {
      
      this.harshaa = data.harshaa;
      this.screenDisabled = (this.harshaa == 16 || this.harshaa == 64);
      this.onlySpecipicYechida = (this.harshaa == 16 || this.harshaa == 32);
    });
  }
  protected ConvertDayOfWeekToInt(date: Date): number {
    let result: number = 0;
    switch (date.getDay()) {
      case DayOfWeek.Friday:
        result = Yamim.Friday;
        break;

      case DayOfWeek.Monday:
        result = Yamim.Monday;
        break;

      case DayOfWeek.Saturday:
        result = Yamim.Saturday;
        break;

      case DayOfWeek.Sunday:
        result = Yamim.Sunday;
        break;

      case DayOfWeek.Thursday:
        result = Yamim.Thursday;
        break;

      case DayOfWeek.Tuesday:
        result = Yamim.Tuesday;
        break;

      case DayOfWeek.Wednesday:
        result = Yamim.Wednesday;
        break;
    }
    return result;

  }


}