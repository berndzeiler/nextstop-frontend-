import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, AsyncValidator } from '@angular/forms';
import { StopsService } from '../../services/stops.service';
import { map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Directive({
  selector: '[wea5ShortNameValidator]',
  standalone: true,
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: ShortNameValidatorDirective,
      multi: true,
    },
  ],
})
export class ShortNameValidatorDirective implements AsyncValidator {

  constructor(private stopsService: StopsService) {}

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    const shortName = control.value;

    if (!shortName) {
      return of(null); // Skip validation if the field is empty
    }

    // Check if the shortName is unique via the service
    return this.stopsService.isShortNameUnique(shortName).pipe(
      map((isUnique) => (isUnique ? null : { shortNameNotUnique: true })),
      catchError(() => of(null)) // Gracefully handle errors
    );
  }
}