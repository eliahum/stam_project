import { Directive, OnDestroy, OnInit } from '@angular/core';
import { DataBindingDirective, GridComponent } from '@progress/kendo-angular-grid';
import { Subscription } from 'rxjs/Subscription';
import {TavlaotAvRemoteDataService} from './nechul-tavlaot-av-remote-data.service';

@Directive({
  selector: '[tavlaotAvBinding]'
})
export class TavlaotAvBindingDirective extends DataBindingDirective implements OnInit, OnDestroy {

  private serviceSubscription: Subscription;
  
  constructor(private tavlaotAvService: TavlaotAvRemoteDataService, grid: GridComponent) {
    super(grid);
  }
  public ngOnInit(): void {
      this.serviceSubscription = this.tavlaotAvService.subscribe((result) => {
      this.grid.loading = false;
      this.grid.data = result;
      this.notifyDataChange();
    });
    super.ngOnInit();
    this.rebind();
  }
  public ngOnDestroy(): void {
    if (this.serviceSubscription) {
      this.serviceSubscription.unsubscribe();
    }
    super.ngOnDestroy();
  }
  public rebind(): void {
    this.grid.loading = true;
    this.tavlaotAvService.query(this.state);    
  }
}
