import { Directive, OnDestroy, OnInit } from '@angular/core';
import { DataBindingDirective, GridComponent } from '@progress/kendo-angular-grid';
import { Subscription } from 'rxjs/Subscription';
import { MaakavRemoteDataService } from './maakav-remote-data.service';




@Directive({
  selector: '[maakavNiudOvdimBinding]'
})
export class MaakavNiudBindingDirective extends DataBindingDirective implements OnInit, OnDestroy {

  private serviceSubscription: Subscription;
  
  constructor(private maakav: MaakavRemoteDataService, grid: GridComponent) {
    super(grid);
  }
  public ngOnInit(): void {
    this.serviceSubscription = this.maakav.subscribe((result) => {
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

    this.maakav.query(this.state);
    

  }
}
