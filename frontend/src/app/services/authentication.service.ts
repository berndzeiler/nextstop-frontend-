import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { authConfig } from '../auth.config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private oauthService: OAuthService) {
    this.configureWithNewConfigApi();
  }

  private configureWithNewConfigApi(): void {
    this.oauthService.configure(authConfig);
  }

  loadAuthState(): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.oauthService
        .loadDiscoveryDocumentAndTryLogin()
        .then(() => {
          observer.next(this.isLoggedIn());
          observer.complete();
        })
        .catch((error) => {
          console.error('Error loading auth state:', error);
          observer.next(false);
          observer.complete();
        });
    });
  }

  login(): void {
    try {
      this.oauthService.initLoginFlow(); // Redirect to Keycloak
    } catch (error) {
      console.error('Login failed:', error);
    }
  }

  logout(): void {
    const currentUrl = window.location.pathname + window.location.search; 
    this.oauthService.logOut(); 
    window.location.href = currentUrl; 
  }

  isLoggedIn(): boolean {
    return this.oauthService.hasValidAccessToken(); // Check if the user is logged in
  }
}