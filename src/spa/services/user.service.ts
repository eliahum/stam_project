import {Injectable} from '@angular/core';
import { IUserData } from '../types/user-data';

@Injectable()
export class SpaUserService {
     userData: IUserData;
     setUserData(data:any):void{
          this.userData=data;
     }
}