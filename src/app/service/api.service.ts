import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/internal/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

const endpoint = 'https://antarescloud.antaresnet.org:8443/api/';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  getListRegioni(): Observable<any> {
    return this.http.get(endpoint + 'list/').pipe(catchError(this.handleError));
  }

  getLatestRegioni(value?: number): Observable<any> {
    if (value) {
      return this.http.get(endpoint + 'regioni/?codice_regione=' + value).pipe(catchError(this.handleError));
    } else {
      return this.http.get(endpoint + 'regioni/?ordering=codice_regione').pipe(catchError(this.handleError));
    }
  }

  getLatestProvince(value: number): Observable<any> {
    return this.http.get(endpoint + 'province/?codice_regione=' + value).pipe(catchError(this.handleError));
  }

  getProvinceInRegione(value: number): Observable<any> {
    return this.http.get(endpoint + 'province/?limit=1000&max_days=30&codice_regione=' + value).pipe(catchError(this.handleError));
  }

  getRiepilogoRegioni(value: number): Observable<any> {
    return this.http.get(endpoint + 'riepilogo/?codice_regione=' + value).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
          `Backend returned code ${error.status}, ` +
          `body was: ${error.error}`);
    }
    return throwError(
        'Something bad happened; please try again later.');
  }
}
