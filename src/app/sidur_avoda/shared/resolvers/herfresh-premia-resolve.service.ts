import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { HefreshPremiaService } from '../..';

@Injectable({
  providedIn: 'root'
})
export class HerfreshPremiaResolveService implements Resolve<any> {

  constructor(private hefreshSrv: HefreshPremiaService) { }

  resolve(): Promise<any> {
    return this.hefreshSrv.GetHefreshPremia(1, 1).toPromise().then(heresh_premia => {
      return heresh_premia;
    });


  }
}
