import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'wea5-admin',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './admin.component.html',
  styles: ``
})
export class AdminComponent {
  isChildRouteActive: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute) {
    // Check, if a child-route(holidays, routes, stops) is active
    this.router.events.subscribe(() => {
      this.isChildRouteActive = this.route.firstChild !== null;
    });
  }
}
