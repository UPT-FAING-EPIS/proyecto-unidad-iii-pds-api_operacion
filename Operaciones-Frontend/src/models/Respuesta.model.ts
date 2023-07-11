import { CuentaBancaria } from './CuentaBancaria';
import { Transaccion } from './Transaccion.model';
import { Transferencia } from './Transferencia.model';

export interface Respuesta {
  timeStamp: string;
  status: string;
  message: string;
  data: {
    transacciones?: Transaccion[];
    transaccion?: Transaccion;
    transferencias?: Transferencia[];
    transferencia?: Transferencia;
    cuentaBancaria?: CuentaBancaria;
  };
  cuentaBancaria?: CuentaBancaria;
}
