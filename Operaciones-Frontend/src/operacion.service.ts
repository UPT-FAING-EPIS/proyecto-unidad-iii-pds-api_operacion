import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Respuesta } from './models/Respuesta.model';
import { TransaccionDTO } from './models/TransaccionDTO';
import { Transferencia } from './models/Transferencia.model';

import { Usuario } from './models/Usuario.model';

@Injectable({
  providedIn: 'root',
})
export class OperacionService {
  private apiUrl: string =
    'https://8080-uptfaingepi-proyectocur-8b246sffwe5.ws-us101.gitpod.io/api/v1';

  constructor(private http: HttpClient) {}

  transacciones$ = <Observable<Respuesta>>(
    this.http
      .get<Respuesta>(`${this.apiUrl}/transacciones`)
      .pipe(tap(console.log), catchError(this.handleError))
  );

  transferenciasByNumeroCuenta$ = (numeroCuenta: string) => {
    const headers = new HttpHeaders({
      'Content-Type': 'text/plain',
    });

    const options = { headers: headers };
    return <Observable<Respuesta>>(
      this.http
        .post<Respuesta>(
          `${this.apiUrl}/transacciones/numerocuenta`,
          numeroCuenta,
          options
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );
  };

  transferencias$ = <Observable<Respuesta>>(
    this.http
      .get<Respuesta>(`${this.apiUrl}/transferencias`)
      .pipe(tap(console.log), catchError(this.handleError))
  );

  saveTransaccion$ = (server: TransaccionDTO) =>
    <Observable<Respuesta>>(
      this.http
        .post<Respuesta>(`${this.apiUrl}/transacciones`, server)
        .pipe(tap(console.log), catchError(this.handleError))
    );

  guardarTransferencia$ = (server: Transferencia) =>
    <Observable<Respuesta>>(
      this.http
        .post<Respuesta>(`${this.apiUrl}/transferencias/`, server)
        .pipe(tap(console.log), catchError(this.handleError))
    );

  consultaSaldo$ = (numeroCuenta: string) => {
    const headers = new HttpHeaders({
      'Content-Type': 'text/plain',
    });
    const options = { headers: headers };
    return <Observable<Respuesta>>(
      this.http
        .post<Respuesta>(`${this.apiUrl}/consultasaldo/`, numeroCuenta, options)
        .pipe(tap(console.log), catchError(this.handleError))
    );
  };

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error);
    return throwError(
      () => new Error(`${error.error.message} - Error code: ${error.status}`)
    );
  }
}
