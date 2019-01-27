import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from '../..';

@Injectable({
  providedIn: 'root'
})
export class UserHarshaaResolveService  implements Resolve<any> {

  constructor(private router: Router,private userService:UserService) { }
  
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):  Promise<any>  {
    
    

      return this.userService.GetUserHarshaa(route.routeConfig.path).toPromise().then(harshaa=>{
        return harshaa;
      });

  
    }
}
