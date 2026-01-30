import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { map } from 'rxjs';

export interface DataResponse<T> {
  status: any;
  data: T;
}

export interface CotizacionCompraIn {
  bomId: number | null;
  cantidadFabricacion: number; // o string si lo manejas así
}

// Ajusta según tu DTO real
export interface ContizacioncompraService {
  bomId: number | null;
  cantidadFabricacion: number; // o string si lo manejas así
}

export interface CotizacionCompraOut {
  id: number;
  bomId: number;
  cantidadFabricacion: number;
  total: number;
  idSede?: number;
  creadoEn?: string;
  activo?: boolean;
  detalles?: any[];
}

@Injectable({ providedIn: 'root' })
export class CotizacionCompraService {
  private apiUrl = environment.apiUrlBase;
  private readonly _http = inject(HttpClient);

  get urlCotizacionCompraService(): string {
    return `${this.apiUrl}/api/mf/cotizacion-compra/consultar-paginado`;
  }

  listarPaginado(payload: any) {
    return this._http.post<DataResponse<any>>(this.urlCotizacionCompraService, payload);
  }

  registrarCotizacion(data: CotizacionCompraIn) {
    return this._http.post(`${this.apiUrl}/api/mf/cotizacion-compra`, data);
  }

  obtenerPorId(id: number) {
    return this._http.get(`${this.apiUrl}/api/mf/cotizacion-compra/${id}`);
  }

  editar(id: number, data: CotizacionCompraIn) {
    return this._http.put(`${this.apiUrl}/api/mf/cotizacion-compra/${id}`, data);
  }

  anular(id: number) {
    return this._http.delete(`${this.apiUrl}/api/mf/cotizacion-compra/${id}`);
  }
}
