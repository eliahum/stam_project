import { Directive, OnDestroy, OnInit } from '@angular/core';
import { DataBindingDirective, GridComponent } from '@progress/kendo-angular-grid';
import { Subscription } from 'rxjs/Subscription';
import { HeadrutRemoteDataService } from './headrut-remote-data.service';



@Directive({
  selector: '[headrutBinding]'
})
export class HeadrutBindingDirective extends DataBindingDirective implements OnInit, OnDestroy {

  private serviceSubscription: Subscription;
  
  constructor(private headruyot: HeadrutRemoteDataService, grid: GridComponent) {
    super(grid);
  }
  public ngOnInit(): void {
    this.serviceSubscription = this.headruyot.subscribe((result) => {
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

    this.headruyot.query(this.state);
    

  }
}
