export type ReqEstado = 'REGISTRADO' | 'EN_DISENO' | 'COTIZADO' | 'APROBADO' | 'CERRADO' | 'ANULADO';

export type CotEstado = 'BORRADOR' | 'ENVIADA' | 'APROBADA' | 'RECHAZADA';

export interface InsumoCreateDTO {
  tipo: string; // "MATERIA_PRIMA" | "AVIO" | "SERVICIO"
  nombre: string;
  unidadCompra?: string | null;
  unidadConsumo?: string | null;
  factorConversion?: number | null;
  costoUnitCompra?: number | null;
}

export interface InsumoDTO {
  id: number;
  tipo: string;
  nombre: string;
  unidadCompra?: string | null;
  unidadConsumo?: string | null;
  factorConversion?: number | null;
  costoUnitCompra: number;
  activo: boolean;
}

export interface RequerimientoCreateDTO {
  idCliente?: number | null;
  contacto?: string | null;
  descripcion: string;
  colores?: string | null;
  tallas?: string | null;
  cantidadTotal?: number | null;
  fechaRequerida?: string | null; // yyyy-MM-dd
  presupuestoObjetivo?: number | null;
}

export interface RequerimientoDTO {
  id: number;
  idCliente?: number | null;
  contacto?: string | null;
  descripcion: string;
  colores?: string | null;
  tallas?: string | null;
  cantidadTotal: number;
  fechaRequerida?: string | null;
  presupuestoObjetivo?: number | null;
  estado: ReqEstado | string;
}

export interface BomDetalleCreateDTO {
  idInsumo: number;
  cantidadPorUnidad: number;
  mermaPct?: number | null;
  obligatorio: boolean;
}

export interface BomCreateDTO {
  idModelo: number;
  nombre?: string | null;
  detalles: BomDetalleCreateDTO[];
}

export interface CotizacionCreateDTO {
  idRequerimiento: number;
  idModelo: number;
  idBom: number;
  volumen: number;
  costoManoObra?: number | null;
  costoIndirectos?: number | null;
  margenPct?: number | null;
}

export interface CotizacionDTO {
  id: number;
  idRequerimiento: number;
  idModelo: number;
  idBom: number;
  volumen: number;
  costoMateriales: number;
  costoManoObra: number;
  costoIndirectos: number;
  costoTotal: number;
  precioUnitario: number;
  margenPct: number;
  estado: CotEstado | string;
}

export interface MrpDetalleDTO {
  idInsumo: number;
  nombreInsumo: string;
  requerido: number;
  disponible: number;
  faltante: number;
}

export interface MrpDTO {
  id: number;
  idOp: number;
  idAlmacen: number;
  estado: string;
  detalles: MrpDetalleDTO[];
}

export interface RequisicionFromMrpDTO {
  idMrp: number;
}

export interface RecepcionDetDTO {
  idInsumo: number;
  cantidad: number;
  costoUnit?: number | null;
}

export interface RecepcionCreateDTO {
  idAlmacen: number;
  referencia?: string | null;
  proveedor?: string | null;
  detalles: RecepcionDetDTO[];
}

export interface ConsumoDetDTO {
  idInsumo: number;
  cantidad: number;
  costoUnit?: number | null;
}

export interface ConsumoCreateDTO {
  idOp: number;
  idAlmacen: number;
  detalles: ConsumoDetDTO[];
}
export interface InsumoOption {
  id: number;
  nombre: string;
  codigo?: string;
  unidad?: string;
  costoUnitCompra?: number;
}

export interface FichaOption {
  id: number;
  codigo: string;
  nombre: string;
}