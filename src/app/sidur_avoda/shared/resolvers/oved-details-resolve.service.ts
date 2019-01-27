import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { IPirteiOved } from '../types/pirtei_oved';
import { OvedService } from '../..';
import { Observable } from 'rxjs-compat/Observable';

@Injectable({
  providedIn: 'root'
})
export class OvedDetailsResolve implements Resolve<IPirteiOved> {
  
    constructor(private router: Router, private ovedService: OvedService) { }
  
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):  Promise<IPirteiOved>  {
    
    
      let id = +route.params["id"];
      let k_user= route.queryParams["k_user"];
      let myid=k_user ?k_user:id;
      return this.ovedService.GetOvedById(myid).toPromise().then(oved=>{
        return oved;
      });
  
    }

  }



 

