import { Component } from '@angular/core';
import { OperacionService } from '../operacion.service';
import { Respuesta } from '../models/Respuesta.model';
import { AppState } from '../models/AppState';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  startWith,
} from 'rxjs';
import { DataState } from '../enum/data.state.enum';
import { NgForm } from '@angular/forms';
import { TransaccionDTO } from '../models/TransaccionDTO';
import { Transferencia } from '../models/Transferencia.model';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  appState$: Observable<AppState<Respuesta>>;
  private dataSubject = new BehaviorSubject<Respuesta>(null);
  private isLoading = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.isLoading.asObservable();

  appStateTransferencias$: Observable<AppState<Respuesta>>;
  private dataSubjectTransferencias = new BehaviorSubject<Respuesta>(null);
  private isLoadingTransferenciaByNumeroCuenta = new BehaviorSubject<boolean>(
    false
  );
  public isLoadingTransferenciaByNumeroCuenta$ =
    this.isLoadingTransferenciaByNumeroCuenta.asObservable();

  appStateConsultaSaldo$: Observable<AppState<Respuesta>>;
  private dataSubjectConsultaSaldo = new BehaviorSubject<Respuesta>(null);

  readonly DataState = DataState;

  constructor(
    private operacionService: OperacionService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.getAllTransacciones();
    this.getAllTransferencias();
    this.consultarSaldo(<NgForm>{ value: { numeroCuenta: '1234-5678-9101' } });
  }

  consultarSaldo(consultaSaldoForm: NgForm): void {
    this.isLoading.next(true);
    this.appStateConsultaSaldo$ = this.operacionService
      .consultaSaldo$(consultaSaldoForm.value.numeroCuenta as string)
      .pipe(
        map((response) => {
          this.notificationService.onInfo(response.message);
          this.dataSubjectConsultaSaldo.next(response);
          this.isLoading.next(false);
          return {
            dataState: DataState.LOADED_STATE,
            appData: {
              ...response,
              data: { cuentaBancaria: response.data.cuentaBancaria },
            },
          };
        }),
        startWith({
          dataState: DataState.LOADING_STATE,
        }),
        catchError((error: string) => {
          this.isLoading.next(false);
          this.notificationService.onDanger(error);
          return of({ dataState: DataState.ERROR_STATE, error: error });
        })
      );
  }

  getAllTransacciones(): void {
    this.appState$ = this.operacionService.transacciones$.pipe(
      map((response) => {
        this.notificationService.onInfo(response.message);
        this.dataSubject.next(response);
        return {
          dataState: DataState.LOADED_STATE,
          appData: {
            ...response,
            data: { transacciones: response.data.transacciones.reverse() },
          },
        };
      }),
      startWith({
        dataState: DataState.LOADING_STATE,
      }),
      catchError((error: string) => {
        this.notificationService.onDanger(error);
        return of({ dataState: DataState.ERROR_STATE, error: error });
      })
    );
  }

  getAllTransferencias(): void {
    this.appStateTransferencias$ = this.operacionService.transferencias$.pipe(
      map((response) => {
        this.notificationService.onInfo(response.message);
        this.dataSubjectTransferencias.next(response);
        return {
          dataState: DataState.LOADED_STATE,
          appData: {
            ...response,
            data: {
              transferencias: response.data.transferencias.reverse(),
            },
          },
        };
      }),
      startWith({
        dataState: DataState.LOADING_STATE,
      }),
      catchError((error: string) => {
        this.notificationService.onDanger(error);
        return of({ dataState: DataState.ERROR_STATE, error: error });
      })
    );
  }

  getTransaccionesByNumeroCuenta(
    transaccionesByNumeroCuentaForm: NgForm
  ): void {
    this.isLoadingTransferenciaByNumeroCuenta.next(true);
    this.appState$ = this.operacionService
      .transferenciasByNumeroCuenta$(
        transaccionesByNumeroCuentaForm.value.numeroCuenta as string
      )
      .pipe(
        map((response) => {
          this.notificationService.onInfo(response.message);
          this.dataSubject.next(response);
          this.isLoadingTransferenciaByNumeroCuenta.next(false);
          return {
            dataState: DataState.LOADED_STATE,
            appData: {
              ...response,
              data: { transacciones: response.data.transacciones.reverse() },
            },
          };
        }),
        startWith({
          dataState: DataState.LOADING_STATE,
        }),
        catchError((error: string) => {
          this.isLoadingTransferenciaByNumeroCuenta.next(false);
          this.notificationService.onDanger(error);
          return of({ dataState: DataState.ERROR_STATE, error: error });
        })
      );
  }

  saveTransaccion(transaccionForm: NgForm): void {
    this.isLoading.next(true);
    this.appState$ = this.operacionService
      .saveTransaccion$(transaccionForm.value as TransaccionDTO)
      .pipe(
        map((response) => {
          this.dataSubject.next({
            ...response,
            data: {
              transacciones: [
                response.data.transaccion,
                ...this.dataSubject.value.data.transacciones,
              ],
            },
          });
          this.notificationService.onInfo(response.message);
          document.getElementById('closeModal').click();
          this.isLoading.next(false);
          transaccionForm.reset({ tipo: 'DEPOSITO' });
          return {
            dataState: DataState.LOADED_STATE,
            appData: this.dataSubject.value,
          };
        }),
        startWith({
          dataState: DataState.LOADED_STATE,
          appData: this.dataSubject.value,
        }),
        catchError((error: string) => {
          this.isLoading.next(false);
          document.getElementById('closeModal').click();
          this.notificationService.onDanger(error);
          return of({ dataState: DataState.ERROR_STATE, error: error });
        })
      );
  }

  guardarTransferencia(transferenciaForm: NgForm): void {
    this.isLoading.next(true);
    this.appStateTransferencias$ = this.operacionService
      .guardarTransferencia$(transferenciaForm.value as Transferencia)
      .pipe(
        map((response) => {
          this.dataSubjectTransferencias.next({
            ...response,
            data: {
              transferencias: [
                response.data.transferencia,
                ...this.dataSubjectTransferencias.value.data.transferencias,
              ],
              transferencia: response.data.transferencia,
            },
          });
          this.notificationService.onInfo(response.message);
          document.getElementById('closeModal2').click();
          this.isLoading.next(false);
          transferenciaForm.reset();
          return {
            dataState: DataState.LOADED_STATE,
            appData: this.dataSubjectTransferencias.value,
          };
        }),
        startWith({
          dataState: DataState.LOADED_STATE,
          appData: this.dataSubjectTransferencias.value,
        }),
        catchError((error: string) => {
          this.isLoading.next(false);
          document.getElementById('closeModal2').click();
          this.notificationService.onDanger(error);
          return of({ dataState: DataState.ERROR_STATE, error: error });
        })
      );
  }
}
