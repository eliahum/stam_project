export class MidaNosaf {
    dtHeadrutMe?: Date;
    dtHeadrutAd?: Date;
    HasPremia?: boolean;
    IsMale?: boolean;
    Kamut?: number;
    Heara: string;
    OvedId:number;
    constructor(_dtHeadrutMe?: Date,
        _dtHeadrutAd?: Date,
        _HasPremia?: boolean,
        _IsMale?: boolean,
        _Kamut?: number
    //    _KodYechida?: string
    ) {
        this.dtHeadrutAd = _dtHeadrutAd;
        this.dtHeadrutMe = _dtHeadrutMe;
        this.HasPremia = _HasPremia;
        this.IsMale = _IsMale;
        this.Kamut = _Kamut;
        //this.KodYechida=_KodYechida;
    }
}

