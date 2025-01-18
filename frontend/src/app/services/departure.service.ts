import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, Observable } from 'rxjs';
import { Departure } from '../models/departure.model';
import { ErrorHandlerService } from './helper/error-handler.service';

@Injectable({
  providedIn: 'root',
})
export class DepartureService {
  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) { }

  getNextDepartures(
    stopShortName: string,
    dateTime: string,
    connections: number
  ): Observable<Departure[]> {
    const params = new HttpParams()
      .set('dateTime', dateTime)
      .set('connections', connections.toString());

    return this.http.get<Departure[]>(`${environment.server}/departureboard/board/${stopShortName}`,{ params })
      .pipe(catchError((error) => this.errorHandler.handle<Departure[]>(error)));
  }
}
