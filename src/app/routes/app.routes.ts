import { Routes } from '@angular/router';
import { AppHomeComponent } from './app-home/app-home.component';

import { SidurAvodaNgComponent } from '../sidur_avoda/pages/sidur-avoda-ng/sidur-avoda-ng.component';
import { HeadrutNgComponent } from '../sidur_avoda/pages/headrut-ng/headrut-ng.component';
import { NochechutOvedComponent } from '../sidur_avoda/pages/nochechut-oved/nochechut-oved.component';
import { OvedDetailsResolve } from '../sidur_avoda/shared/resolvers/oved-details-resolve.service';
import { MaakavNiudOvdimComponent } from '../sidur_avoda/pages/maakav-niud-ovdim/maakav-niud-ovdim.component';
import { ShichrurOvedComponent } from '../sidur_avoda/pages/shichrur-oved/shichrur-oved.component';
import { TikuneiRechevComponent } from '../sidur_avoda/pages/tikunei-rechev/tikunei-rechev.component';
import { DochSicumHeadrutComponent } from '../sidur_avoda/reports/sidur_avoda/doch-sicum-headrut/doch-sicum-headrut.component';
import { DochSicumSidurAvodaComponent } from '../sidur_avoda/reports/sidur_avoda/doch-sicum-sidur-avoda/doch-sicum-sidur-avoda.component';
import { DochSicumKleiRechevComponent } from '../sidur_avoda/reports/sidur_avoda/doch-sicum-klei-rechev/doch-sicum-klei-rechev.component';
import { DochOvdimPnuimComponent } from '../sidur_avoda/reports/sidur_avoda/doch-ovdim-pnuim/doch-ovdim-pnuim.component';
import { DochMaakavNiudOvdimComponent } from '../sidur_avoda/reports/sidur_avoda/doch-maakav-niud-ovdim/doch-maakav-niud-ovdim.component';
import { DochSicumPeiluyotComponent } from '../sidur_avoda/reports/sidur_avoda/doch-sicum-peiluyot/doch-sicum-peiluyot.component';
import { DochChodshiLeOvedComponent } from '../sidur_avoda/reports/sidur_avoda/doch-chodshi-le-oved/doch-chodshi-le-oved.component';
import { DochSicumMesimotBeSidurComponent } from '../sidur_avoda/reports/sidur_avoda/doch-sicum-mesimot-be-sidur/doch-sicum-mesimot-be-sidur.component';
import { DochYomanPeiluyotComponent } from '../sidur_avoda/reports/sidur_avoda/doch-yoman-peiluyot/doch-yoman-peiluyot.component';
import {DochNehigaVeRechizComponent} from '../sidur_avoda/reports/premiot/doch-nehiga-ve-rechiz/doch-nehiga-ve-rechiz.component';
import {DochPremiyaLePoalimComponent} from '../sidur_avoda/reports/premiot/doch-premiya-le-poalim/doch-premiya-le-poalim.component';
import {DochPremiyaLeNaagimComponent} from '../sidur_avoda/reports/premiot/doch-premiya-le-naagim/doch-premiya-le-naagim.component';
import {DochShgiyaHishuvPremiyaComponent} from '../sidur_avoda/reports/premiot/doch-shgiya-hishuv-premiya/doch-shgiya-hishuv-premiya.component';
import {DochYemimLoNisgeruComponent} from '../sidur_avoda/reports/premiot/doch-yemim-lo-nisgeru/doch-yemim-lo-nisgeru.component';
import {DochHarigeyHafuchDachasShkayeyKarkaComponent} from '../sidur_avoda/reports/premiot/doch-harigey-hafuch-dachas-shkayey-karka/doch-harigey-hafuch-dachas-shkayey-karka.component';
import {NechulTavlaotAvComponent} from '../sidur_avoda/pages/nechul-tavlaot-av/nechul-tavlaot-av.component';
import { UserHarshaaResolveService } from '../sidur_avoda/shared/resolvers/user-harshaa-resolve.service';
import { HefresheiPremiaComponent } from '../sidur_avoda/pages/hefreshei-premia/hefreshei-premia.component';
import { HefresheiPremiaActionComponent } from '../sidur_avoda/pages/hefreshei-premia-action/hefreshei-premia-action.component';
import { HerfreshPremiaResolveService } from '../sidur_avoda/shared/resolvers/herfresh-premia-resolve.service';
export const appRoutes: Routes = [
    { path: 'home', component: AppHomeComponent },
    {
        path: "siduravodang",/*canDeactivate:[CanDeactivateGuard],*/component: SidurAvodaNgComponent,
        resolve: {
            harshaa: UserHarshaaResolveService
        }

    },
    {
        path: "headrut", component: HeadrutNgComponent,
        resolve: {
            harshaa: UserHarshaaResolveService
        }
    },
    {
        path: "nochechutoved/:id",
        component: NochechutOvedComponent,
        resolve: {
            oved: OvedDetailsResolve,
            harshaa: UserHarshaaResolveService
        }
    },
    {
        path: "maakavniudovdim", component: MaakavNiudOvdimComponent,
        resolve: {
            harshaa: UserHarshaaResolveService
        }
    },
    {
        path: "shichruroved", component: ShichrurOvedComponent,
        resolve: {
            harshaa: UserHarshaaResolveService
        }
    },
    {
        path: "tikuneirechev", component: TikuneiRechevComponent,
        resolve: {
            harshaa: UserHarshaaResolveService
        }
    },
    
    {path: "doch_sicum_headrut",component: DochSicumHeadrutComponent, resolve: {
        harshaa: UserHarshaaResolveService
    }}, 
    {path: "doch_sicum_sidur_avoda",component: DochSicumSidurAvodaComponent, resolve: {
        harshaa: UserHarshaaResolveService
    }}, 
    {path: "doch_sicum_klei_rechev",component: DochSicumKleiRechevComponent, resolve: {
        harshaa: UserHarshaaResolveService
    }}, 
    {path: "doch_ovdim_pnuim",component: DochOvdimPnuimComponent, resolve: {
        harshaa: UserHarshaaResolveService
    }}, 
    {path: "doch_maakav_niud_ovdim",component: DochMaakavNiudOvdimComponent, resolve: {
        harshaa: UserHarshaaResolveService
    }}, 
    {path: "doch_sicum_peiluyot",component: DochSicumPeiluyotComponent, resolve: {
        harshaa: UserHarshaaResolveService
    }}, 
    {path: "doch_chodshi_le_oved",component: DochChodshiLeOvedComponent, resolve: {
        harshaa: UserHarshaaResolveService
    }}, 
    {path: "doch_sicum_mesimot_be_sidur",component: DochSicumMesimotBeSidurComponent, resolve: {
        harshaa: UserHarshaaResolveService
    }}, 
    {path: "doch_yoman_peiluyot",component: DochYomanPeiluyotComponent, resolve: {
        harshaa: UserHarshaaResolveService
    }}, 
    {path: "doch_nehiga_ve_rechiza",component: DochNehigaVeRechizComponent, resolve: {
        harshaa: UserHarshaaResolveService
    }}, 
    {path: "doch_premiya_le_poalim",component: DochPremiyaLePoalimComponent, resolve: {
        harshaa: UserHarshaaResolveService
    }}, 
    {path: "doch_premiya_le_naagim",component: DochPremiyaLeNaagimComponent, resolve: {
        harshaa: UserHarshaaResolveService
    }}, 
    {path: "doch_shgiya_hishuv_premiya",component: DochShgiyaHishuvPremiyaComponent, resolve: {
        harshaa: UserHarshaaResolveService
    }}, 
    {path: "doch_yemim_lo_nisgeru",component: DochYemimLoNisgeruComponent, resolve: {
        harshaa: UserHarshaaResolveService
    }}, 
    {path: "doch_harigey_hafuch_dachas_shkayey_karka",component: DochHarigeyHafuchDachasShkayeyKarkaComponent, resolve: {
        harshaa: UserHarshaaResolveService
    }}, 
    {path: "nechul_tavlaot_av",component: NechulTavlaotAvComponent, resolve: {
        harshaa: UserHarshaaResolveService
    }}, 
    {path: "hefreshei_premia",component: HefresheiPremiaComponent, resolve: {
        harshaa: UserHarshaaResolveService
    }}, 
    {path: "hefreshei_premia_action/:id",component: HefresheiPremiaActionComponent, resolve: {
        hefresh_premia:  HerfreshPremiaResolveService,
        harshaa: UserHarshaaResolveService,
        oved: OvedDetailsResolve
    }}, 
    
    
    
    
    
    
    

    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: '**', component: AppHomeComponent},
    

];