import { Component, OnInit } from '@angular/core';
import { HolidaysService } from '../../services/holidays.service';
import { Holiday } from '../../models/holiday.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'wea5-holidays',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './holidays.component.html',
  styles: ``
})
export class HolidaysComponent implements OnInit {
  holidays: Holiday[] = [];

  constructor(private holidaysService: HolidaysService, private router: Router) {}

  ngOnInit(): void {
    this.loadHolidays();
  }

  loadHolidays(): void {
    this.holidaysService.getHolidays().subscribe({
      next: (data) => (this.holidays = data),
      error: (err) => console.error('Error loading holidays:', err),
    });
  }

  editHoliday(holiday: Holiday): void {
    this.router.navigate(['/admin/holidays', holiday.holidayId]);
  }

  deleteHoliday(holidayId: number): void {
    this.holidaysService.deleteHoliday(holidayId).subscribe({
      next: () => this.loadHolidays(),
      error: (err) => console.error('Error deleting holiday:', err),
    });
  }
}
