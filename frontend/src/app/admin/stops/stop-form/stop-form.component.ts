import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { StopsService } from '../../../services/stops.service';
import { Stop } from '../../../models/stop.model';
import { CommonModule } from '@angular/common';
import { StopFormErrorMessages } from '../../../helpers/error-message';
import { floatValidator } from '../../../helpers/validators/float-validator.directive';
import { ShortNameValidatorDirective } from '../../../helpers/validators/short-name-validator.directive';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'wea5-stop-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './stop-form.component.html',
  styles: []
})
export class StopFormComponent implements OnInit {
  stopForm!: FormGroup;
  shortName: string | null = null;
  errors: { [key: string]: string } = {};

  private readonly numRegex = /^-?\d*[.,]?\d{0,14}$/;

  constructor(
    private fb: FormBuilder,
    private stopsService: StopsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.stopForm = this.fb.group({
      shortName: [
        '',
        [Validators.required, Validators.pattern(/^[A-Za-z0-9]+$/)],
        [new ShortNameValidatorDirective(this.stopsService).validate.bind(this)],
      ],
      name: ['', Validators.required],
      latitude: ['', [
        Validators.required, 
        Validators.pattern(this.numRegex), 
        floatValidator(true)]
      ],
      longitude: ['', [
        Validators.required, 
        Validators.pattern(this.numRegex), 
        floatValidator(false)]
      ],
    });

    const shortName = this.route.snapshot.paramMap.get('shortName');
    if (shortName) {
      this.shortName = shortName;
      this.stopForm.get('shortName')?.disable(); // Disable shortName-field if it is an Update
      this.stopsService.getStopByShortName(shortName).subscribe({
        next: (stop) => this.stopForm.patchValue(stop),
        error: (err) => console.error('Error loading stop:', err),
      });
    } else {
      // Automatically convert `shortName` to uppercase on changes with debounce
      this.stopForm.get('shortName')?.valueChanges
      .pipe(debounceTime(50))
      .subscribe((value) => {
        if (value && typeof value === 'string') {
          this.stopForm.get('shortName')?.setValue(value.toUpperCase(), { emitEvent: false });
        }
      });
    }

    this.stopForm.statusChanges.subscribe(() => this.updateErrorMessages());
  }

  saveStop(): void {
    if (this.stopForm.valid) {
      const latitude = this.stopForm.value.latitude;
      const longitude = this.stopForm.value.longitude;

      const stop: Stop = { 
        ...this.stopForm.getRawValue(), // Get raw value to include the disabled shortName
        latitude: parseFloat(
          (typeof latitude === 'string' ? latitude : latitude.toString()).replace(',', '.')
        ),
        longitude: parseFloat(
          (typeof longitude === 'string' ? longitude : longitude.toString()).replace(',', '.')
        ),
      };

      if (this.shortName) {
        // Update
        this.stopsService.updateStop(this.shortName, stop).subscribe({
          next: () => this.router.navigate(['/admin/stops']),
          error: (err) => console.error('Error updating stop:', err),
        });
      } else {
        // Create
        this.stopsService.createStop(stop).subscribe({
          next: () => this.router.navigate(['/admin/stops']),
          error: (err) => console.error('Error creating stop:', err),
        });
      }
    }
  }

  cancel(): void {
    this.router.navigate(['/admin/stops']);
  }

  updateErrorMessages(): void {
    this.errors = {};

    for (const message of StopFormErrorMessages) {
      const control = this.stopForm.get(message.forControl);
      if (
        control &&
        control.dirty &&
        control.invalid &&
        control.errors != null &&
        control.errors[message.forValidator] &&
        !this.errors[message.forControl]
      ) {
        this.errors[message.forControl] = message.text;
      }
    }
  }
}
