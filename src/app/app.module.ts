import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { AppComponent } from './app.component';
import { SpaModule } from 'src/spa/spa.module';
import { RouterModule } from '@angular/router';
import { appRoutes } from './routes/app.routes';
import { AppHomeComponent } from './routes/app-home/app-home.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './core/auth/auth-interceptor';
import { YechidaService } from './sidur_avoda/shared/services/yechida.service';
import { SidurAvodaModule } from './sidur_avoda/sidur-avoda.module';
import { DictionaryService } from './sidur_avoda/shared/services/dictionary.service';


import { ToastModule } from 'primeng/toast';
import { GridModule } from '@progress/kendo-angular-grid';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogsModule } from '@progress/kendo-angular-dialog';

export function startupServiceDictionary(startupService: DictionaryService): Function {
  return () => startupService.load();
}



@NgModule({
  declarations: [
    AppComponent,
    AppHomeComponent
  ],
  imports: [
    BrowserModule, SidurAvodaModule,
    ToastModule,
    SpaModule, RouterModule.forRoot(appRoutes), HttpClientModule, GridModule, BrowserAnimationsModule, DialogsModule
  ],
  providers: [YechidaService,DictionaryService,
    {provide: HTTP_INTERCEPTORS,useClass: AuthInterceptor,multi: true},
    { provide: APP_INITIALIZER, useFactory: startupServiceDictionary, deps: [DictionaryService], multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
