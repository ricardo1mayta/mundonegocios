import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { PedidosMensualesDto } from '../../models/reportes/pedidos-mensuales-dto';
export interface DataRequestDto {
  buscador?: string;
  idSede?: number;
  desde?: string; // YYYY-MM-DD
  hasta?: string; // YYYY-MM-DD
  idProducto?: number;
  idCliente?: number;
  docCliente?: string;
  codigoPedido?: string;
}

export interface VwReporteGananciaDetalleDto {
  idRow: string;
  idPedido: number;
  fechaPedido: string; // LocalDateTime -> ISO string
  fechaDia: string; // LocalDate -> YYYY-MM-DD
  idSede: number;
  codigoPedido: string;
  idCliente: number | null;
  docCliente: string | null;
  cliente: string | null;
  idPedidoDetalle: number;
  idProducto: number;
  producto: string;
  cantidad: number;
  precioVentaUnit: number;
  costoUnitario: number;
  ventaBruta: number;
  descuento: number;
  impuesto: number;
  gananciaBruta: number;
  gananciaNeta: number;
}
export interface GenericoRequestPaginadoDto<T> {
  page: number; // 0-based
  size: number;
  sort?: string; // "fechaPedido,desc"
  data: T;
}
export interface DataRequestDto {
  buscador?: string;
  idSede?: number;
  desde?: string; // YYYY-MM-DD
  hasta?: string; // YYYY-MM-DD
  idProducto?: number;
  idCliente?: number;
  docCliente?: string;
  codigoPedido?: string;
}

export interface DataResponse<T> {
  status: any;
  data: T;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
@Injectable({
  providedIn: 'root',
})
export class ReportePedidosService {
  private apiUrl = environment.apiUrlBase;

  private readonly _http = inject(HttpClient);

  getPedidosMensuales(): Observable<PedidosMensualesDto[]> {
    return this._http.get<PedidosMensualesDto[]>(`${this.apiUrl}/pegasus/reportes/pedidos-mensuales`);
  }
  getPedidosMensualesGeneral(): Observable<PedidosMensualesDto[]> {
    return this._http.get<PedidosMensualesDto[]>(`${this.apiUrl}/pegasus/reportes/pedidos-mensuales-general`);
  }
  getPedidosDia(): Observable<number> {
    return this._http.get<number>(`${this.apiUrl}/pegasus/reportes/dia-mes`);
  }

  get urlReporteGananciaDetalle(): string {
    return `${this.apiUrl}/pegasus/reportes/ganancia-detalle/consultar-paginado`;
  }
  listarPaginado(payload: any) {
    return this._http.post(this.urlReporteGananciaDetalle, payload);
  }
  listarPaginadoCompras(payload: any) {
    return this._http.post(`${this.apiUrl}/pegasus/reportes/compras-detalle/consultar-paginado`, payload);
  }
  listarPaginadoCuadre(payload: any) {
    return this._http.post(`${this.apiUrl}/pegasus/reportes/cuadre-diario/consultar-paginado`, payload);
  }
  montoTotalMercaderia() {
    return this._http.get(`${this.apiUrl}/pegasus/reportes/ganancia-detalle/kpi/monto-total-mercaderia`);
  }
}