export class Cotizacion {
  id!: number;
  idCliente!: number;
  nombreCliente!: string;
  docCliente!: string;
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
}
