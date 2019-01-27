import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { Observable } from 'rxjs/Observable';

import { UserDataService } from 'src/app/shared/services/user-data.service';
import { HttpClient } from '@angular/common/http';

export abstract class RemoteDataService extends BehaviorSubject<GridDataResult> {
  
  skip: number = 0;
  pageSize = 12;
  lastState: any;
  public loading: boolean;
  abstract fetch(state: any): Observable<GridDataResult>;
  constructor(protected userData: UserDataService,
    protected http: HttpClient) {
    super(null);
  }
  public query(state: any): void {
    this.lastState = state;
    this.fetch(state)
      .subscribe(
        x => super.next(x)
      );
  }
  public refresh() {
    this.fetch(this.lastState)
      .subscribe(x => super.next(x));
  }
}
