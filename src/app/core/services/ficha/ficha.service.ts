import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { map } from 'rxjs';
import { FichaOption } from '../../models/fabricacion/fabricacion.models';
export interface DataResponse<T> {
  status: any;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class FichaService {
  private apiUrl = environment.apiUrlBase;
  private readonly _http = inject(HttpClient);

  get urlFichaService(): string {
    return `${this.apiUrl}/api/mf/fichas-tecnicas/consultar-paginado`;
  }
  opcionesFicha(payload: { q: string; limit?: number }) {
    return this._http.post<DataResponse<FichaOption[]>>(`${this.apiUrl}/api/mf/fichas-tecnicas/autocomplete`, payload).pipe(map(r => r.data ?? []));
  }
  //agregar registrar Ficha
  registrarFicha(data: any) {
    return this._http.post(`${this.apiUrl}/api/mf/fichas-tecnicas`, data);
  }

  obtenerFichaPorId(id: number) {
    return this._http.get(`${this.apiUrl}/api/mf/fichas-tecnicas/${id}`);
  }
  editarFicha(id: any, data: any) {
    return this._http.put(`${this.apiUrl}/api/mf/fichas-tecnicas/${id}`, data);
  }
  anularFicha(id: number) {
    return this._http.delete(`${this.apiUrl}/api/mf/fichas-tecnicas/${id}`);
  }
}