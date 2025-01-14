import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';

@Directive({
  selector: '[wea5UniqueStopsValidator]',
  standalone: true,
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: UniqueStopsValidatorDirective,
      multi: true,
    },
  ],
})
export class UniqueStopsValidatorDirective implements Validator {
  constructor() {}

  validate(control: AbstractControl): ValidationErrors | null {
    return uniqueStopsValidator()(control);
  }
}

export function uniqueStopsValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const startStop = control.get('startStop')?.value;
    const endStop = control.get('endStop')?.value;

    if (startStop && endStop && startStop === endStop) {
      return { sameStops: true };
    }

    return null; // No errors
  };
}