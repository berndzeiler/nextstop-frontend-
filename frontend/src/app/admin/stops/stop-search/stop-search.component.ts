import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { StopsService } from '../../../services/stops.service';
import { Stop } from '../../../models/stop';
import { debounceTime, distinctUntilChanged, filter, switchMap, tap } from 'rxjs';
import { NgClass } from '@angular/common';

@Component({
  selector: 'wea5-stop-search',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './stop-search.component.html',
  styles: []
})
export class StopSearchComponent {
  @Output() stopSelected = new EventEmitter<Stop>();

  @ViewChild('searchTerm', { static: true }) searchTermInput!: ElementRef<HTMLInputElement>;
  
  isLoading: boolean = false;
  foundStops: Stop[] = [];
  searchTerm: string = '';
  hasSearched: boolean = false;
  keyup = new EventEmitter<string>();

  constructor(private stopsService: StopsService) {}

  ngOnInit() {
    this.keyup.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      tap(() => {
        if (this.searchTerm.trim() === '') {
          this.isLoading = false;
          this.foundStops = [];
          this.hasSearched = false;
        } else {
          this.isLoading = true;
          this.hasSearched = true;
        }
      }),
      filter((searchTerm) => searchTerm.trim() !== ''), // Only trigger the search if search term is not empty
      switchMap(searchTerm => this.stopsService.searchStops(searchTerm)),
      tap(() => this.isLoading = false)
    ).subscribe(stops => this.foundStops = stops || []);
  }

  onSearchTermChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value.trim();
    this.searchTerm = value;
    // Reset foundStops when searchTerm is empty
    if (value === '') {
      this.foundStops = [];
      this.hasSearched = false;
    }
    this.keyup.emit(value);
  }

  selectStop(stop: Stop) {
    this.stopSelected.emit(stop);
    this.resetSearchField();
  }

  resetSearchField() {
    this.searchTerm = '';
    this.foundStops = [];
    this.hasSearched = false;

    if (this.searchTermInput) {
      this.searchTermInput.nativeElement.value = '';
    }
  }
}