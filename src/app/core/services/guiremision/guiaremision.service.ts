import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Cotizacion } from '../../models/ventas/cotizaciones';

@Injectable({
  providedIn: 'root',
})
export class GuiaremisionService {
  private apiUrl = environment.apiUrlBase;

  private readonly _http = inject(HttpClient);
  get urlConsultarPedidos(): string {
    return `${this.apiUrl}/pegasus/guia-remision/consultar-paginado`;
  }
  registrarGuiaRemision(pedido: any): Observable<any> {
    return this._http.post(`${this.apiUrl}/pegasus/guia-remision`, pedido, { observe: 'response' });
  }
  obtenerPedidoPorId(id: number): Observable<Cotizacion> {
    return this._http.get<Cotizacion>(`${this.apiUrl}/pegasus/guia-remision/${id}`);
  }
  editarGuiaRemision(id: any, pedido: any): Observable<any> {
    return this._http.put(`${this.apiUrl}/pegasus/guia-remision/${id}`, pedido, { observe: 'response' });
  }
  // agregar servicio tiket

  obtenerTiketPorId(id: number) {
    return this._http.get(`${this.apiUrl}/pegasus/guia-remision/tiket/${id}`, { responseType: 'blob' });
  }
}
