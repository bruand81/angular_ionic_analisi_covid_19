import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/internal/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

// const endpoint = 'https://antarescloud.antaresnet.org:8443/api/';
const endpoint = 'http://127.0.0.1:8000/api/';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  getListRegioni(): Observable<any> {
    // return this.http.get(endpoint + 'list/').pipe(catchError(this.handleError));
    return this.http.get(endpoint + 'regioni/?fields=codice_regione,denominazione_regione').pipe(catchError(this.handleError));
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
    // return this.http.get(endpoint + 'riepilogo/?codice_regione=' + value).pipe(catchError(this.handleError));
    const url = endpoint + 'regioni/?codice_regione=' + value + '&max_days=30&fields=data,codice_regione,' +
        'denominazione_regione,nuovi_positivi,variazione_deceduti,variazione_dimessi_guariti,variazione_ricoverati_con_sintomi,' +
        'variazione_terapia_intensiva,variazione_tamponi,incidenza_7d,nuovi_positivi_7dma,nuovi_positivi_3dma,incidenza,' +
        'percentuale_positivi_casi_giornaliera,percentuale_variazione_terapia_intensiva,percentuale_variazione_deceduti,' +
        'percentuale_positivi_casi_7dma,cfr,variazione_terapia_intensiva_7dma,variazione_deceduti_7dma,' +
        'variazione_ricoverati_con_sintomi_7dma,nuovi_positivi_7d_incr,terapia_intensiva_7d_incr,deceduti_7d_incr,' +
        'dimessi_guariti_7d_incr,ricoverati_con_sintomi_7d_incr,ingressi_terapia_intensiva,' +
        'percentuale_variazione_ingressi_terapia_intensiva,totale_positivi_test_molecolare,variazione_totale_positivi_test_molecolare,' +
        'totale_positivi_test_antigenico_rapido,variazione_totale_positivi_test_antigenico_rapido,tamponi_test_molecolare,' +
        'variazione_tamponi_test_molecolare,tamponi_test_antigenico_rapido,variazione_tamponi_test_antigenico_rapido,' +
        'note_test,note_casi';
    // console.log(url);
    return this.http.get(url).pipe(catchError(this.handleError));
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
