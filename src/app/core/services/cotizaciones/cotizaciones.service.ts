import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cotizacion } from '../../models/ventas/cotizaciones';

@Injectable({
  providedIn: 'root',
})
export class CotizacionesService {
  private apiUrl = environment.apiUrlBase;

  private readonly _http = inject(HttpClient);
  get urlConsultarPedidos(): string {
    return `${this.apiUrl}/pegasus/cotizaciones/consultar-paginado`;
  }
  registrarPedido(pedido: any): Observable<any> {
    return this._http.post(`${this.apiUrl}/pegasus/cotizaciones`, pedido);
  }
  obtenerPedidoPorId(id: number): Observable<Cotizacion> {
    return this._http.get<Cotizacion>(`${this.apiUrl}/pegasus/cotizaciones/${id}`);
  }
  editarPedido(id: any, pedido: any): Observable<any> {
    return this._http.put(`${this.apiUrl}/pegasus/cotizaciones/${id}`, pedido);
  }
  // agregar servicio tiket

  obtenerTiketPorId(id: number) {
    return this._http.get(`${this.apiUrl}/pegasus/cotizaciones/tiket/${id}`, { responseType: 'blob' });
  }
}
