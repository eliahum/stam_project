import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { NechulTavlaotAvService } from '../../shared/services/nechul-tavlaot-av.service';
import { Observable } from 'rxjs/Observable';

export class ValidateKodMesimaTaken {
  constructor() { }

  public static kodMesimaValidator(nechulTavlaotAvService: NechulTavlaotAvService): AsyncValidatorFn {
      return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
        return nechulTavlaotAvService.checkKodMesimaTaken(control.value);
      };
    
  }
}
