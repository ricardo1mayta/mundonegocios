import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Pedido } from '../../models/ventas/pedidos';

export type TipoComprobante = 'BOLETA' | 'FACTURA';

export interface PedidoFacturacionPayload {
  pedido: any;
  tipoComprobante: TipoComprobante;
  serie?: string;
}

export interface EstadoFacturacionResponse {
  pedidoId?: number;
  estado?: string;
  estadoFacturacion?: string;
  rutaXml?: string | null;
  rutaPdf?: string | null;
  tipoComprobante?: TipoComprobante | null;
  serie?: string | null;
}

@Injectable({ providedIn: 'root' })
export class PedidosService {
  private apiUrl = environment.apiUrlBase;
  private readonly _http = inject(HttpClient);

  get urlConsultarPedidos(): string {
    return `${this.apiUrl}/pegasus/pedidos/consultar-paginado`;
  }

  get urlExportarPedidos(): string {
    return `${this.apiUrl}/pegasus/pedidos/exportar-excel`;
  }

  get urlConsultarFacturacionPedidos(): string {
    return `${this.apiUrl}/pegasus/pedidos-facturacion/consultar-paginado`;
  }

  registrarPedido(pedido: any): Observable<any> {
    return this._http.post(`${this.apiUrl}/pegasus/pedidos`, pedido);
  }

  registrarPedidoFacturacion(payload: PedidoFacturacionPayload): Observable<any> {
    return this._http.post(`${this.apiUrl}/pegasus/pedidos-facturacion/registrar`, payload);
  }

  consultarEstadoFacturacion(pedidoId: number): Observable<EstadoFacturacionResponse> {
    return this._http.get<EstadoFacturacionResponse>(`${this.apiUrl}/pegasus/pedidos-facturacion/${pedidoId}/estado`);
  }

  emitirComprobante(pedidoId: number): Observable<any> {
    return this._http.post(`${this.apiUrl}/pegasus/pedidos-facturacion/${pedidoId}/emitir`, {});
  }

  obtenerXmlFacturacion(pedidoId: number): Observable<Blob> {
    return this._http.get(`${this.apiUrl}/pegasus/pedidos-facturacion/${pedidoId}/xml`, { responseType: 'blob' });
  }

  obtenerPdfFacturacion(pedidoId: number): Observable<Blob> {
    return this._http.get(`${this.apiUrl}/pegasus/pedidos-facturacion/${pedidoId}/pdf`, { responseType: 'blob' });
  }

  obtenerPedidoPorId(id: number): Observable<Pedido> {
    return this._http.get<Pedido>(`${this.apiUrl}/pegasus/pedidos/${id}`);
  }

  editarPedido(id: any, pedido: any): Observable<any> {
    return this._http.put(`${this.apiUrl}/pegasus/pedidos/${id}`, pedido);
  }

  obtenerTiketPorId(id: number) {
    return this._http.get(`${this.apiUrl}/pegasus/pedidos/tiket/${id}`, { responseType: 'blob' });
  }

  anularPedido(id: number): Observable<any> {
    return this._http.delete(`${this.apiUrl}/pegasus/pedidos/${id}`);
  }
}
