import { Injectable } from '@angular/core';
import { IConfig } from '../shared/config';
import { HttpClient, HttpParams, HttpRequest, HttpEventType } from '@angular/common/http';
import { MenuService } from './menu.service';
import { of, Observable } from 'rxjs';
import 'rxjs/add/observable/fromPromise';


export interface Icons {
    imageFile: string;
    url: string;
    alt: string;
}

export interface SpaConfigSettings {
    showUserControls?: boolean;
    socialIcons?: Array<Icons>;
}
@Injectable()
export class SpaConfigService {
    public config: IConfig;
    showUserControls = true;
    socialIcons = new Array<Icons>();
    thisObject: SpaConfigService;
    constructor(private http: HttpClient, private menuService: MenuService) { }
    configure(settings: SpaConfigSettings): void {
        Object.assign(this, settings);
    }
    private mapItems(routes: any[]): any[] {
        return routes.map(item => {
            const result: any = {
                text: item.text == undefined ? '' : item.text,
                path: item.route_values == undefined ? '' : item.route_values,
                icon: item.icon
            };

            return result;
        });
    }
    load(): Promise<any> {
        let thisObject = this;
        return new Promise((resolve, reject) => {
            this.loadConfig().then(() => {
                this.menuService.GetAllMenus(thisObject.config.getAllMenus).subscribe(menus => {
                    this.menuService.items = menus;
                    resolve();
                });
            });

        });
    } 
    public loadConfig(): Promise<IConfig> {
        return new Promise(resolve => {
            this.http.get<IConfig>('assets/config/config.json')
                .subscribe(config => {
                    this.config = config;
                    resolve();
                });
        });
    }
}