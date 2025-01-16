import { Component, EventEmitter, Output } from '@angular/core';
import { Stop } from '../models/stop.model';
import { NgClass } from '@angular/common';
import { GpsSearchComponent } from './gps-search/gps-search.component';

@Component({
  selector: 'wea5-gps-modal',
  standalone: true,
  imports: [
    NgClass,
    GpsSearchComponent
  ],
  templateUrl: './gps-modal.component.html',
  styles: [],
})
export class GpsModalComponent {
  @Output() stopSelected = new EventEmitter<Stop>();
  isOpen = false;

  openModal(): void {
    this.isOpen = true;
  }

  closeModal(): void {
    this.isOpen = false;
  }

  onStopSelected(stop: Stop): void {
    this.stopSelected.emit(stop);
    this.closeModal();
  }
}
