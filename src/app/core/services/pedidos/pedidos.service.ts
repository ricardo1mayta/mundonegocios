import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Pedido } from '../../models/ventas/pedidos';

// ajusta los paths

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

  registrarPedido(pedido: any): Observable<any> {
    return this._http.post(`${this.apiUrl}/pegasus/pedidos`, pedido);
  }
  obtenerPedidoPorId(id: number): Observable<Pedido> {
    return this._http.get<Pedido>(`${this.apiUrl}/pegasus/pedidos/${id}`);
  }
  editarPedido(id: any, pedido: any): Observable<any> {
    return this._http.put(`${this.apiUrl}/pegasus/pedidos/${id}`, pedido);
  }
  // agregar servicio tiket

  obtenerTiketPorId(id: number) {
    return this._http.get(`${this.apiUrl}/pegasus/pedidos/tiket/${id}`, { responseType: 'blob' });
  }
  anularPedido(id: number): Observable<any> {
    return this._http.delete(`${this.apiUrl}/pegasus/pedidos/${id}`);
  }
}
