import {Injectable} from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { map, tap } from 'rxjs/operators';


import { Observable } from 'rxjs/internal/Observable';
import { IMenu } from '../shared/menu';
export interface MenuItem {
    text: string;
    icon: string;
    route: string;
    submenu: Array<MenuItem>;
}

@Injectable()
export class MenuService {
 
    items: Array<MenuItem>;
    isVertical = false;
    showVerticalMenu = false;
    constructor(private http: HttpClient) { }
    toggleMenu(): void {
        this.isVertical = true;
        this.showVerticalMenu = !this.showVerticalMenu;
    }
    toggleOrientation(): void {
        this.isVertical = !this.isVertical;
    }
    public GetAllMenus(url:string): Observable<any> {
        //params = params.append('temp','1');
        return this.http.get<IMenu[]>(url).pipe(
          tap((menu: IMenu[]) => console.log(menu)),
          map(data=>data)
        );
    
      }
}