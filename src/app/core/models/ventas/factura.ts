import { Clientes } from './clientes'; // reemplaza con tu clase real
import { DetalleFactura } from './detallefactura';

export class Factura {
  id!: number;
  ublVersion!: string;
  tipoOperacion!: string;
  tipoDoc!: string;
  serie!: string;
  correlativo!: string;
  fechaEmision!: Date;
  formaPago!: any[]; // tipo explícito
  moneda!: string;
  tipo!: string;
  cliente!: Clientes[]; // o solo Cliente si es uno solo
  idsede!: number;
  mtoOperGravadas!: number;
  mtoIGV!: number;
  valorVenta!: number;
  totalImpuestos!: number;
  subTotal!: number;
  mtoImpVenta!: number;
  legends!: any[]; // tipo explícito
  detalle!: DetalleFactura[];
}
