import { Component, Input } from '@angular/core';
import { Stop } from '../../models/stop.model';

@Component({
  selector: 'wea5-selected-stop-display',
  standalone: true,
  template: `
    @if (selectedStop) {
      <div class="ui message">
        <strong>Ausgewählte Haltestelle:</strong> {{ selectedStop.name }} ({{ selectedStop.shortName }})
      </div>
    }
  `,
  styles: []
})
export class SelectedStopDisplayComponent {
  @Input() selectedStop: Stop | null = null;
}