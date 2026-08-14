export class DetalleFactura {
  id!: number;
  producto!: string;
  codProducto!: string;
  unidad!: string;
  descripcion!: string;
  cantidad!: number;
  mtoValorUnitario!: number;
  mtoValorVenta!: number;
  mtoBaseIgv!: number;
  porcentajeIgv!: number;
  igv!: number;
  tipAfeIgv!: string;
  totalImpuestos!: number;
  mtoPrecioUnitario!: number;
  total!: number;
}