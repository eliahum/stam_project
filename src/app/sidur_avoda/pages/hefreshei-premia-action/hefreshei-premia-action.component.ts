import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BasePageSidurComponent } from '../base-page-sidur/base-page-sidur-component';
import { IYechidaIrgunit, HefreshPremia, ComboItem, MesimaService } from '../..';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { IPirteiOved } from '../../shared/types/pirtei_oved';
import { PirteiOvedComponent } from '../../components/pirtei-oved/pirtei-oved.component';
import { SugMesima } from '../../shared/types/sug-mesima';
import { DictionaryService } from '../../shared/services/dictionary.service';
import * as moment from 'moment';

@Component({
  selector: 'app-hefreshei-premia-action',
  templateUrl: './hefreshei-premia-action.component.html',
  styleUrls: ['./hefreshei-premia-action.component.scss']
})
export class HefresheiPremiaActionComponent extends BasePageSidurComponent implements OnInit {
  public mekoreiDivuach: Array<{ text: string, value: number }> = [
    { text: "תכנון ובקרה", value: 1 },
    { text: "משאבי אנוש", value: 2 },
    { text: "הנהלה", value: 3 },
    { text: "תחנות", value: 4 }

  ];

  public mekorDivuach: { text: string, value: number } = { text: "תכנון ובקרה", value: 1 };

  public sugeiDivuach: Array<{ text: string, value: number }> = [
    { text: "שוטף", value: 1 },
    { text: "הפרשים", value: 2 },
    { text: "התערבות ידנית", value: 3 }
  ];

  public sugDivuach: { text: string, value: number } = { text: "שוטף", value: 1 };

  public zvaim: Array<{ text: string, value: number }> = [
    { text: "אדום", value: 1 },
    { text: "ירוק", value: 2 }
  ];

  public zeva: { text: string, value: number } = { text: "אדום", value: 1 };


  public lstSugeiMesima: Array<{ text: string, value: number }> = [
    { text: "אדום", value: 1 },
    { text: "ירוק", value: 2 }
  ];

  public sugMesima: SugMesima = { teur_male_sug_mesima: "מחסנאי", k_sug_mesima: 41 };

  public sibatHeadrut:ComboItem={text:"123",value:12};
  public lstSibotHeadrut: Array<{ text: string, value: number }> = [
    { text: "אדום", value: 1 },
    { text: "ירוק", value: 2 }
  ];

  public lstKodeiMesimot: [];

  public kodMesima: any={kod_mesima:"11810"};

  zman_hatchala: Date;
  hefresh_premia: any;
  @ViewChild(PirteiOvedComponent)
  pirteiOved: PirteiOvedComponent;

  hefreshForm: FormGroup;
  constructor(
    private router:Router,
    private fb: FormBuilder,
    private mesimaService: MesimaService,
    private dictService: DictionaryService,
    protected activatedRoute: ActivatedRoute) {
    super(activatedRoute);

  }
  createFormGroup(row: HefreshPremia): FormGroup {

    this.mekorDivuach.value = row ? row.kod_sug_makor_divuach_premia : 1;
    this.sugDivuach.value = row ? row.kod_sug_divuach_premia : 1;
    this.zeva.value = row ? row.id_tzeva : 1;
    this.sugMesima.k_sug_mesima = 80;
    
    this.sibatHeadrut.value=row.id_sug_headrut;

    this.kodMesima.kod_mesima=  row.kod_mesima;

    let form: FormGroup = this.fb.group({
      'id_yechida': row.id_yechida,
      'kod_yechida': row.kod_yechida,
      'mekorDivuach': [this.mekorDivuach],
      'sugDivuach': [this.sugDivuach],
      'sw_pail': row.sw_pail,
      'zman_hatchala': new Date(row.zman_hatchala),
      'zman_sof': new Date(row.zman_sof),
      'yami_divoach':row.yami_divoach,
      'achuz_premia': row.achuz_premia,
      'achuz_premia_all': row.achuz_premia * row.yami_divoach,
      'zeva': [this.zeva],
      'sugMesima': [this.sugMesima],
      'sibatHeadrut':[this.sibatHeadrut],
      'kodMesima':[this.kodMesima],
      'chodeshHuavarLeSachar':[row.houvar_le_schar?moment(row.houvar_le_schar).format("MM"):'']
    });

    return form;
  }

  ngOnInit() {
    

    this.activatedRoute.data.forEach((data: { oved: IPirteiOved, hefresh_premia: any, harshaa: any }) => {


      this.pirteiOved.Oved = data.oved;


      this.pirteiOved.IsCardVisible = false;
      this.hefresh_premia = data.hefresh_premia;
      this.hefreshForm = this.createFormGroup(this.hefresh_premia);
      this.harshaa = data.harshaa;
      this.screenDisabled = (this.harshaa == 16 || this.harshaa == 64);
      this.onlySpecipicYechida = (this.harshaa == 16 || this.harshaa == 32);

      this.dictService.getData<any>("sugei_mesimot").subscribe((result)=>{
        this.lstSugeiMesima = result;
      });

      this.dictService.getData<any>("sibot_headrut").subscribe((result)=>{
        this.lstSibotHeadrut = result;
      });

       this.dictService.getData<any>("kodei_mesimot").subscribe((result)=>{
        this.lstKodeiMesimot = result;
      });


    });


    //this.hefreshForm.controls.sugMesima.setValue(80);
    //this.hefreshForm.controls.sugMesima.setValue(80);



  }
  OnYechidaMevazaatChanged({ yechidaData, action }) {
    let row = yechidaData as IYechidaIrgunit;
    if (action != 'init') {
      //      this.headrutRemoteDataService.refresh();//.query({ skip: 0, take: 12 });
    }
  }

  OnCloseYechidaMevazaat(row: IYechidaIrgunit) {

    if (row != 'empty') {
    }

  }
  OnReturnHefreshim(){
    this.router.navigate(["/hefreshei_premia"]);
  }

}
