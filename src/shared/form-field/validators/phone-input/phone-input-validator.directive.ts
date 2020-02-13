import { Directive, ElementRef, forwardRef, HostListener, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator } from '@angular/forms';
import { CountryCode, isValidNumber, parsePhoneNumber, PhoneNumber } from 'libphonenumber-js';
import { maskDigitValidators, neverValidator } from '../../directives/input-mask/helpers/digit-validators';

const PHONE_VALIDATOR: any = {
  multi: true,
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => PhoneInputValidatorDirective),
};

@Directive({
  providers: [PHONE_VALIDATOR],
  selector: '[phone][ngModel]',
})

/**
 * phone number is validated by an external library google-libphonenumber.
 * the library validates the number input and the country code to make sure the phone number is valid.
 * country code is either set by siteconfiguration or by user detail country code
 * @todo chnage how default country code is set for when user is logged out
 * on blur, the phone number value is formatted with prepended country code if not already added
 * also restricts key input to numbers only
 *
 * @example <input name="mobile" [(ngModel)]="mobile" [phone]="GB">
 * @class PhoneInputValidatorDirective
 * @implements Validator
 * @author Spencer Anum
 * @updated 12/06/2018
 * @version 1.0.0
 */
export class PhoneInputValidatorDirective implements Validator {

  @Input('phone') private country: CountryCode | string = 'GB';
  private target: any;

  private phoneNumber: PhoneNumber;

  constructor(private el: ElementRef) {
    this.target = el.nativeElement;
  }

  /** on input blur format phone number */
  @HostListener('blur', ['$event'])
  public formatPhone(): void {
    if (!this.target.value) {
      return;
    }
    const phone = parsePhoneNumber(this.target.value, this.country.toUpperCase() as CountryCode);
    if (isValidNumber(phone.number)) {
      this.target.value = phone.number as any;
    }
  }

  /** keypress validate input is numeric */
  @HostListener('keypress', ['$event', '$event.keyCode'])
  public onKeypress($event: KeyboardEvent, keyCode: number): void {
    const key = String.fromCharCode(keyCode);
    const digitValidator = maskDigitValidators[9] || neverValidator;
    if (!digitValidator(key)) {
      $event.preventDefault();
    }
  }

  /** validates the input value by first checking and replacing the preceeding value
   * then validating the number with isValidNumber method in libphonenumber-js library
   */
  public validate(control: AbstractControl): { [key: string]: any } {
    if (control.value && control.value.length > 3) {
      this.phoneNumber = parsePhoneNumber(control.value, this.country.toUpperCase() as CountryCode);
      if (this.phoneNumber) {
        if (!isValidNumber(this.phoneNumber.number)) {
          return { phone: true };
        } else {
          return;
        }
      }
    }
    return;
  }
}
