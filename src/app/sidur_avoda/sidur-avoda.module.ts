import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule, LOCALE_ID, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, ErrorHandler } from '@angular/core';
import { CommonModule, DatePipe, registerLocaleData } from '@angular/common';
import { SidurAvodaService, NihulPremiaService, MesimaService, UserService, OvedService, TikuneiRechevService, RechevService, NochechutOvedService } from '.';
import { ToastrModule } from 'ngx-toastr';
import { MidaNosafNgComponent } from './components/mida-nosaf-ng/mida-nosaf-ng.component';
import {DialogModule} from 'primeng/dialog';
import {CalendarModule} from 'primeng/calendar';
import {ToastModule} from 'primeng/toast';
import {PaginatorModule} from 'primeng/paginator';
import {DataViewModule} from 'primeng/dataview';
import {TableModule} from 'primeng/table';
import {PanelModule} from 'primeng/panel';
import {ButtonModule} from 'primeng/button';
import '@progress/kendo-angular-intl/locales/he/all';
import { GridModule } from '@progress/kendo-angular-grid';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { IntlModule } from '@progress/kendo-angular-intl';
import { ButtonsModule } from '@progress/kendo-angular-buttons'
import {DialogModule as DialogModuleKendo} from '@progress/kendo-angular-dialog';
import { RTL } from '@progress/kendo-angular-l10n';
import { NumericTextBoxModule } from '@progress/kendo-angular-inputs';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns' ;
import { InputsModule } from '@progress/kendo-angular-inputs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DictionaryService } from './shared/services/dictionary.service';
import { SidurAvodaNgComponent } from './pages/sidur-avoda-ng/sidur-avoda-ng.component';
import { HeadrutNgComponent } from './pages/headrut-ng/headrut-ng.component';
import { OvedNgComponent, RechevNgComponent, YechidaCompNgComponent, StatusMesimaComponent, ShinuiKavuaNgComponent, HearatSidurComponent, DropdownForTableComponent, YesNoDialogComponent } from './components';
import { MishtanaNgComponent } from './components/mishtana-ng/mishtana-ng.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MessageService } from 'primeng/api';
import { UserDataService } from '../shared/services/user-data.service';
import { NochechutOvedComponent } from './pages/nochechut-oved/nochechut-oved.component';
import { MenuModule } from 'primeng/components/menu/menu';
import { PanelMenuModule, EditorModule, DialogService } from 'primeng/primeng';
import { OvedDetailsResolve } from './shared/resolvers/oved-details-resolve.service';
import { PirteiOvedComponent } from './components/pirtei-oved/pirtei-oved.component';
import { HeadrutBindingDirective } from './pages/headrut-ng/remote-binding-headrut.directive';
import { HeadrutRemoteDataService } from './pages/headrut-ng/headrut-remote-data.service';
import { NochechutOvedRemoteDataService } from './pages/nochechut-oved/nochechut-oved-remote-data.service';
import { NochechutOvedBindingDirective } from './pages/nochechut-oved/remote-binding-nochechut-oved.directive';
import { PopupModule } from '@progress/kendo-angular-popup';
import { MaakavNiudOvdimComponent } from './pages/maakav-niud-ovdim/maakav-niud-ovdim.component';
import { MaakavNiudOvdimService } from './shared/services/maakav-niud-ovdim.service';
import { MaakavNiudBindingDirective } from './pages/maakav-niud-ovdim/remote-binding-maakav.directive';
import { MaakavRemoteDataService } from './pages/maakav-niud-ovdim/maakav-remote-data.service';
import localeHe from '@angular/common/locales/he';
import localeHeExtra from '@angular/common/locales/extra/he';
import { ShichrurOvedComponent } from './pages/shichrur-oved/shichrur-oved.component';
import { ShichrurRemoteDataService } from './pages/shichrur-oved/shichrur-remote-data.service';

import { TikuneiRechevComponent } from './pages/tikunei-rechev/tikunei-rechev.component';
import { TikuneiRechevRemoteDataService } from './pages/tikunei-rechev/tikunei-rechev-remote-data.service';
import { TikuneiRechevBindingDirective } from './pages/tikunei-rechev/remote-binding-tikunei-rechev.directive';
import { ShichrurBindingDirective } from './pages/shichrur-oved/remote-binding-shichrur.directive';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { TikunRechevComponent } from './pages/tikunei-rechev/tikun-rechev.component';
import { OnlyNumberDirective } from 'src/spa/directives/only-number.directive';
import { DochSicumHeadrutComponent } from './reports/sidur_avoda/doch-sicum-headrut/doch-sicum-headrut.component';
import { BaseReportComponent } from './reports/base-report-component';
import { UserHarshaaResolveService } from './shared/resolvers/user-harshaa-resolve.service';
import { TavlaotAvRemoteDataService } from './pages/nechul-tavlaot-av/nechul-tavlaot-av-remote-data.service';
import { DochChodshiLeOvedComponent } from './reports/sidur_avoda/doch-chodshi-le-oved/doch-chodshi-le-oved.component';
import { BasePageSidurComponent } from './pages/base-page-sidur/base-page-sidur-component';
import { DochSicumKleiRechevComponent } from './reports/sidur_avoda/doch-sicum-klei-rechev/doch-sicum-klei-rechev.component';
import { DochOvdimPnuimComponent } from './reports/sidur_avoda/doch-ovdim-pnuim/doch-ovdim-pnuim.component';
import { DochMaakavNiudOvdimComponent } from './reports/sidur_avoda/doch-maakav-niud-ovdim/doch-maakav-niud-ovdim.component';
import { DochSicumPeiluyotComponent } from './reports/sidur_avoda/doch-sicum-peiluyot/doch-sicum-peiluyot.component';
import { DochYomanPeiluyotComponent } from './reports/sidur_avoda/doch-yoman-peiluyot/doch-yoman-peiluyot.component';
import { OnlyNumberMustDirective } from 'src/spa/directives/only-number-must.directive';
import { TavlaotAvBindingDirective } from './pages/nechul-tavlaot-av/nechul-tavlaot-av.directive';
import { DochSicumMesimotBeSidurComponent } from './reports/sidur_avoda/doch-sicum-mesimot-be-sidur/doch-sicum-mesimot-be-sidur.component';
import { DochSicumSidurAvodaComponent } from './reports/sidur_avoda/doch-sicum-sidur-avoda/doch-sicum-sidur-avoda.component';
import { DochNehigaVeRechizComponent } from './reports/premiot/doch-nehiga-ve-rechiz/doch-nehiga-ve-rechiz.component';
import { DochPremiyaLePoalimComponent } from './reports/premiot/doch-premiya-le-poalim/doch-premiya-le-poalim.component';
import { DochPremiyaLeNaagimComponent } from './reports/premiot/doch-premiya-le-naagim/doch-premiya-le-naagim.component';
import { DochShgiyaHishuvPremiyaComponent } from './reports/premiot/doch-shgiya-hishuv-premiya/doch-shgiya-hishuv-premiya.component';
import { DochYemimLoNisgeruComponent } from './reports/premiot/doch-yemim-lo-nisgeru/doch-yemim-lo-nisgeru.component';
import { DochHarigeyHafuchDachasShkayeyKarkaComponent } from './reports/premiot/doch-harigey-hafuch-dachas-shkayey-karka/doch-harigey-hafuch-dachas-shkayey-karka.component';
import { NechulTavlaotAvComponent } from './pages/nechul-tavlaot-av/nechul-tavlaot-av.component';
import { HefresheiPremiaComponent } from './pages/hefreshei-premia/hefreshei-premia.component';
import { HefreshimBindingDirective } from './pages/hefreshei-premia/hefreshim-binding-headrut.directive';
import { HefreshimRemoteDataService } from './pages/hefreshei-premia/hefreshim-remote-data.service';
import { HefresheiPremiaActionComponent } from './pages/hefreshei-premia-action/hefreshei-premia-action.component';
import {SugMesimaNgComponent} from './components/sug-mesima-ng/sug-mesima-ng.component';


registerLocaleData(localeHe, 'he-IL', localeHeExtra);


@NgModule({
  imports: [
    CommonModule,FormsModule, ReactiveFormsModule,DateInputsModule,BrowserAnimationsModule,
    DropDownsModule,NumericTextBoxModule,ButtonsModule,GridModule,InputsModule,
   IntlModule,ToastrModule.forRoot(),NgbModule.forRoot(),EditorModule,
    DialogModule,DialogModuleKendo,CalendarModule,ToastModule,PaginatorModule,DataViewModule,
    TableModule,PanelModule,ButtonModule,PopupModule,DynamicDialogModule
  ],
  providers: [MessageService,DictionaryService,MaakavNiudOvdimService,
    HeadrutRemoteDataService,NochechutOvedRemoteDataService,MaakavRemoteDataService,
    UserDataService,UserService,OvedService,OvedDetailsResolve,
    UserHarshaaResolveService,
    ShichrurRemoteDataService,
    TikuneiRechevRemoteDataService,DialogService,HefreshimRemoteDataService,
    SidurAvodaService,DatePipe,NihulPremiaService,NochechutOvedService,
    MesimaService,TikuneiRechevService,RechevService,TavlaotAvRemoteDataService,
    { provide: RTL, useValue: true },
    { provide: LOCALE_ID, useValue: 'he-IL' }
],
  declarations: [SidurAvodaNgComponent,HeadrutNgComponent,MidaNosafNgComponent,DochChodshiLeOvedComponent,
    BasePageSidurComponent,HefresheiPremiaComponent,
    DochSicumKleiRechevComponent,DochOvdimPnuimComponent,DochMaakavNiudOvdimComponent,DochSicumPeiluyotComponent,
    TikuneiRechevComponent,TikunRechevComponent,DochSicumHeadrutComponent,BaseReportComponent,
    MaakavNiudOvdimComponent,ShichrurOvedComponent,YesNoDialogComponent,DochYomanPeiluyotComponent,
    MaakavNiudBindingDirective,NochechutOvedBindingDirective,HeadrutBindingDirective,ShichrurBindingDirective,
    TikuneiRechevBindingDirective,OnlyNumberDirective,HefreshimBindingDirective,
    OnlyNumberMustDirective,HefresheiPremiaActionComponent,TavlaotAvBindingDirective,
    DochSicumMesimotBeSidurComponent,
    StatusMesimaComponent,HearatSidurComponent,DochSicumSidurAvodaComponent,
    DropdownForTableComponent,NochechutOvedComponent,PirteiOvedComponent,
    RechevNgComponent,OvedNgComponent,MishtanaNgComponent,YechidaCompNgComponent,ShinuiKavuaNgComponent,
    DochNehigaVeRechizComponent, DochPremiyaLePoalimComponent, DochPremiyaLeNaagimComponent, 
    DochShgiyaHishuvPremiyaComponent, DochYemimLoNisgeruComponent, DochHarigeyHafuchDachasShkayeyKarkaComponent,
    NechulTavlaotAvComponent, SugMesimaNgComponent],
    entryComponents: [YesNoDialogComponent,TikunRechevComponent]
})
export class SidurAvodaModule { }
