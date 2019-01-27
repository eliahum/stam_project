import { Directive, OnDestroy, OnInit } from '@angular/core';
import { DataBindingDirective, GridComponent } from '@progress/kendo-angular-grid';
import { Subscription } from 'rxjs/Subscription';
import { ShichrurRemoteDataService } from './shichrur-remote-data.service';




@Directive({
  selector: '[shichrurOvdimBinding]'
})
export class ShichrurBindingDirective extends DataBindingDirective implements OnInit, OnDestroy {

  private serviceSubscription: Subscription;
  
  constructor(private shichrur: ShichrurRemoteDataService, grid: GridComponent) {
    super(grid);
  }
  public ngOnInit(): void {
    this.serviceSubscription = this.shichrur.subscribe((result) => {

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

    this.shichrur.query(this.state);
    

  }
}
