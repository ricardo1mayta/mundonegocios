import { Proveedor } from './provedor'; // Corrige el nombre del archivo si cambiaste

export class Compra {
  id!: number;
  proveedor!: Proveedor;
  serie!: string;
  docProvedor!: string;
  direccion!: string;
  total!: number;
  idSede!: number;
  usuarioCrea!: number;
  usuarioModifica!: number;
  fechaCrea!: Date;
  fechaModifica!: Date;
  observacion!: string;
  status!: number;
  tipoPago!: number;
  pagoEfectivo!: number;
  otroModoPago!: number;
  codigo!: number;
  origen!: string;
  fechaEntrega!: Date;
  cliente!: any; // idealmente reemplazar con una interfaz o clase `Cliente`
}
