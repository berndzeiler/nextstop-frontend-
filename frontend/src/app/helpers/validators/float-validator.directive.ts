import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';

@Directive({
  selector: '[wea5FloatValidator]',
  standalone: true,
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: FloatRangeValidatorDirective,
      multi: true,
    },
  ]
})
export class FloatRangeValidatorDirective implements Validator {
  @Input('wea5FloatValidator') isLatitude: boolean = true; //

  constructor() {}

  validate(control: AbstractControl): ValidationErrors | null {
    return floatValidator(this.isLatitude)(control);
  }
}

export function floatValidator(isLatitude: boolean): ValidatorFn {
  const maxRange = isLatitude ? 90 : 180; // Latitude range: -90 to 90, Longitude range: -180 to 180

  return (control: AbstractControl): ValidationErrors | null => {
    let value = control.value;

    if (!value) {
      return null; // Handle empty value for required validator
    }

    // Check if the value is within the range
    if (value < -maxRange  || value > maxRange ) {
      return { pattern: true };
    }

    return null; // Valid value
  };
}
