import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpaHeaderComponent } from './spa-header/spa-header.component';
import { SpaFooterComponent } from './spa-footer/spa-footer.component';
import { SpaContentComponent } from './spa-content/spa-content.component';
import { SpaBodyComponent } from './spa-body/spa-body.component';
import { SpaConfigService } from './services/spa-config.service';
import { ScreenService } from './services/screen.service';
import { MenuService } from './services/menu.service';
import { RouterModule } from '@angular/router';
import { IconBarComponent } from './icon-bar/icon-bar.component';
import { ScreenSmallDirective } from './directives/screen-small.directive';
import { ScreenLargeDirective } from './directives/screen-large.directive';
import { MenuComponent } from './menus/menu/menu.component';
import { MenuItemComponent } from './menus/menu-item/menu-item.component';
import { PopupMenuComponent } from './menus/popup-menu/popup-menu.component';
import { SpaUserService } from './services/user.service';
import { PopupMenuBootstrapComponent } from './menus/popup-menu-bootstrap/popup-menu-bootstrap.component';
import { MenuItemBootstrapComponent } from './menus/menu-item-bootstrap/menu-item-bootstrap.component';
import { MenuBootstrapComponent } from './menus/menu-bootstrap/menu-bootstrap.component';

@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [SpaBodyComponent, SpaHeaderComponent, SpaContentComponent, SpaFooterComponent,
  IconBarComponent, ScreenSmallDirective, ScreenLargeDirective,
  MenuBootstrapComponent, MenuItemBootstrapComponent, PopupMenuBootstrapComponent,
  MenuComponent, MenuItemComponent, PopupMenuComponent
  
],
  exports: [SpaBodyComponent],
  providers: [SpaConfigService, ScreenService, MenuService,SpaUserService]
})
export class SpaModule { }
