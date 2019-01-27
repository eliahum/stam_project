export class TvrTikunRechev
{
    TikunMashabId?: number;
    SugTikunId?: number;
    MisparRishuiNetzer?:string;
    MisparRishuiNetzerOld?:string;
    MisparPnimi?:string;
    ZmanHatchala?: Date;
    ZmanSof?: Date;
    NahagId?: number;      
    NahagMetikunId?: number;
    GoremMetakenId?: number;
    IsFixed?: number;
    GoremMedaveachId?: number;
    GoremMedaveachMetikunId?: number;
    Heara: string;
    Deleted: number;
    UserName: string;
    MoedIdkun?: Date;
    ObjectId?: number ;
    IsHusarSidur?: number;
    constructor(){}
}

export interface TikunRechev {
    id_tikuni_mashab: number;
    id_sug_tikun: number;
    mispar_pnimi: string;
    id_mashab: string;
    zman_hatchala?: Date
    zman_sof?: Date;
    k_user: number;
    id_gorem_metaken?: number;
    kod_gorem_metaken?: string;
    teur_gorem_metaken?: string;
    sw_metokan?: number;
    meshtamesh_medaveach?: number;
    heara?: string;
    ezor?: number ;
    teur_mesima?: string;
    nahag_full_name?: string;
    gorem_medaveah_full_name?: string;
    mispar_rishui_netzer?: string;
    is_husar_sidur?: number;
}

export class TikunRechevDetails {
    id_tikuni_mashab: number;
    id_sug_tikun: number;
    id_mashab: string;
    zman_hatchala?: Date;
    zman_sof?: Date;
    k_user: number;
    k_user1?: number;;
    id_gorem_metaken?: number;;
    kod_gorem_metaken: string;
    sw_metokan: number;
    meshtamesh_medaveach?: number;;
    gorem_medaveah_full_name: string;
    meshtamesh_medaveach1?: number;;
    gorem_medaveah_metikun_full_name: string;
    heara: string;
    id_object?: number;;
    teur_mesima: string;
    moed_idkun?: Date;
    is_husar_sidur?: number;
    teur_gorem_metaken: string;
    mispar_pnimi?: string;
    constructor(){}
}


 
