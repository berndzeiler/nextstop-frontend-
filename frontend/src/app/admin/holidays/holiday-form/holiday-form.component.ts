import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HolidaysService } from '../../../services/holidays.service';
import { Holiday } from '../../../models/holiday';
import { CommonModule } from '@angular/common';
import { HolidayFormErrorMessages } from '../../../helpers/error-message';
import { dateRangeValidator } from '../../../helpers/validators/date-range-validator.directive';

@Component({
  selector: 'wea5-holiday-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './holiday-form.component.html',
  styles: ``
})
export class HolidayFormComponent implements OnInit {
  holidayForm!: FormGroup;
  holidayId: number | null = null;
  errors: { [key: string]: string } = {};

  constructor(
    private fb: FormBuilder,
    private holidaysService: HolidaysService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.holidayForm = this.fb.group(
      {
        name: ['', Validators.required],
        startDate: ['', Validators.required],
        endDate: ['', Validators.required],
        isSchoolHoliday: [false]
      },
      { validators: dateRangeValidator() }
    );
  
    this.holidayForm.statusChanges.subscribe(() => this.updateErrorMessages());
  
    this.holidayForm.get('startDate')?.valueChanges.subscribe((startDate) => {
      const endDateControl = this.holidayForm.get('endDate');
      if (startDate && !endDateControl?.value) {
        endDateControl?.setValue(startDate); // Automatically set endDate
      }
    });
  
    const holidayId = this.route.snapshot.paramMap.get('id');
    if (holidayId) {
      this.holidayId = +holidayId;
      this.holidaysService.getHolidayById(this.holidayId).subscribe({
        next: (holiday) => this.holidayForm.patchValue(holiday),
        error: (err) => console.error('Error loading holiday:', err)
      });
    }
  }

  saveHoliday(): void {
    if (this.holidayForm.valid) {
      const holiday: Holiday = {
        ...this.holidayForm.value,
        holidayId: this.holidayId || undefined,
      };

      if (this.holidayId) {
        // Update
        this.holidaysService.updateHoliday(holiday).subscribe({
          next: () => this.router.navigate(['/admin/holidays']),
          error: (err) => console.error('Error updating holiday:', err),
        });
      } else {
        // Create
        this.holidaysService.createHoliday(holiday).subscribe({
          next: () => this.router.navigate(['/admin/holidays']),
          error: (err) => console.error('Error creating holiday:', err),
        });
      }
    }
  }

  cancel(): void {
    this.router.navigate(['/admin/holidays']);
  }

  updateErrorMessages() {
    this.errors = {};

    for (const message of HolidayFormErrorMessages) {
      const control = this.holidayForm.get(message.forControl);
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

    // Custom logic for date validation
    const startDate = this.holidayForm.get('startDate')?.value;
    const endDate = this.holidayForm.get('endDate')?.value;

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
        this.errors['endDate'] = 'Enddatum muss nach dem Startdatum liegen.';
    }
  }
}
