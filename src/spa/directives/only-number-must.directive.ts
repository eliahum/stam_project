import { Directive, ElementRef, HostListener, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor, Validator, FormControl } from '@angular/forms';

@Directive({
  selector: '[OnlyNumberMust]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OnlyNumberMustDirective),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => OnlyNumberMustDirective),
      multi: true,
    }]
})
export class OnlyNumberMustDirective implements  ControlValueAccessor, Validator {
  private parseError: boolean= false;
  private data: any;

  public validate(c: FormControl) {

    if (c.value==1) return null;
else 
return {
      jsonParseError: {
        valid: false,
      }};
  
    //return null;
    /*return {
      jsonParseError: {
        valid: true,
      }};*/
    /*return (!this.parseError) ? null : {
      jsonParseError: {
        valid: false,
      },
  };*/

  }
  writeValue(obj: any): void {
    
    if (obj) {
      this.data = obj;
    }
  }
  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }
  private propagateChange = (_: any) => {


   };
  registerOnTouched(fn: any): void {
    
  }
  setDisabledState?(isDisabled: boolean): void {
  }
  registerOnValidatorChange?(fn: () => void): void {
    
  }

  constructor(private el: ElementRef) {this.parseError=false; }
  @Input() OnlyNumberMust: boolean;
  @HostListener('keydown', ['$event']) onKeyDown(event) {
    let e = <KeyboardEvent>event;

    this.validate(new FormControl(1));
    if (this.OnlyNumberMust) {
      if ([46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
        // Allow: Ctrl+A
        (e.keyCode === 65 && (e.ctrlKey || e.metaKey)) ||
        // Allow: Ctrl+C
        (e.keyCode === 67 && (e.ctrlKey || e.metaKey)) ||
        // Allow: Ctrl+V
        (e.keyCode === 86 && (e.ctrlKey || e.metaKey)) ||
        // Allow: Ctrl+X
        (e.keyCode === 88 && (e.ctrlKey || e.metaKey)) ||
        // Allow: home, end, left, right
        (e.keyCode >= 35 && e.keyCode <= 39)) {
        // let it happen, don't do anything
        return;
      }
     
      // Ensure that it is a number and stop the keypress
      if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault();
      }
    }
  }

}
