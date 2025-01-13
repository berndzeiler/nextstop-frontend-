import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';

@Component({
  selector: 'wea5-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styles: [],
})
export class AppComponent {
  title = 'NextStop';

  constructor(public auth: AuthenticationService) {}

  isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  login(): void {
    this.auth.login();
  }

  logout(): void {
    this.auth.logout();
  }
}
