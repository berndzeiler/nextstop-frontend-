import { Component, OnInit } from '@angular/core';
import { StopsService } from '../../services/stops.service';
import { Stop } from '../../models/stop';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'wea5-stops',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './stops.component.html',
  styles: []
})
export class StopsComponent implements OnInit {
  stops: Stop[] = [];

  constructor(private stopsService: StopsService, private router: Router) {}

  ngOnInit(): void {
    this.loadStops();
  }

  loadStops(): void {
    this.stopsService.getStops().subscribe({
      next: (data) => (this.stops = data),
      error: (err) => console.error('Error loading stops:', err),
    });
  }

  editStop(shortName: string): void {
    this.router.navigate(['/admin/stops', shortName]);
  }

  deleteStop(shortName: string): void {
    this.stopsService.deleteStop(shortName).subscribe({
      next: () => this.loadStops(),
      error: (err) => console.error('Error deleting stop:', err),
    });
  }
}
