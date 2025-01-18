import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  handle<T>(error: Error | any): Observable<T> {
    console.error('Service error:', error);
    return of(null as T);
  }
}
