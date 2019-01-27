import { Directive, OnDestroy, OnInit, Input } from '@angular/core';
import { DataBindingDirective, GridComponent } from '@progress/kendo-angular-grid';
import { Subscription } from 'rxjs/Subscription';
import { NochechutOvedRemoteDataService } from './nochechut-oved-remote-data.service';



@Directive({
  selector: '[nochechutOvedBinding]'
})
export class NochechutOvedBindingDirective extends DataBindingDirective implements OnInit, OnDestroy {

  private serviceSubscription: Subscription;
  @Input() currentUser: number;
  
  constructor(private nochechut: NochechutOvedRemoteDataService, grid: GridComponent) {
    super(grid);
  }
  public ngOnInit(): void {
    this.nochechut.currentUser=this.currentUser;
    this.serviceSubscription = this.nochechut.subscribe((result) => {
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

    this.nochechut.query(this.state);
    

  }
}
