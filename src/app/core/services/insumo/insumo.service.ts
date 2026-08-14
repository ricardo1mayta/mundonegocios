import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { InsumoOption } from '../../models/fabricacion/fabricacion.models';
import { map } from 'rxjs';
export interface DataResponse<T> {
  status: any;
  data: T;
}
@Injectable({
  providedIn: 'root',
})
export class InsumoService {
  private apiUrl = environment.apiUrlBase;
  private readonly _http = inject(HttpClient);

  get urlInsumoService(): string {
    return `${this.apiUrl}/api/mf/insumos/consultar-paginado`;
  }

  //agregar registrar Ficha
  registrarInsumo(data: any) {
    return this._http.post(`${this.apiUrl}/api/mf/insumos`, data);
  }

  opcionesInsumo(data: any) {
    return this._http.post<DataResponse<InsumoOption[]>>(`${this.apiUrl}/api/mf/insumos/autocomplete`, { q: data, limit: 10 }).pipe(map(r => r.data ?? []));
  }

  obtenerInsumoPorId(id: number) {
    return this._http.get(`${this.apiUrl}/api/mf/insumos/${id}`);
  }
  editarInsumo(id: any, data: any) {
    return this._http.put(`${this.apiUrl}/api/mf/insumos/${id}`, data);
  }

  anularInsumo(id: number) {
    return this._http.delete(`${this.apiUrl}/api/mf/insumos/${id}`);
  }

  getTiposInsumo() {
    return this._http.get(`${this.apiUrl}/api/mf/catalogos/tipos-insumo`);
  }
  getUnidades() {
    return this._http.get(`${this.apiUrl}/api/mf/catalogos/unidades`);
  }
}