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
export class BomService {
  private apiUrl = environment.apiUrlBase;
  private readonly _http = inject(HttpClient);

  get urlBomervice(): string {
    return `${this.apiUrl}/api/mf/boms/consultar-paginado`;
  }

  //agregar registrar Ficha
  registrarBom(data: any) {
    return this._http.post(`${this.apiUrl}/api/mf/boms`, data);
  }

  opcionesBom(data: any) {
    return this._http.post<DataResponse<InsumoOption[]>>(`${this.apiUrl}/api/mf/boms/autocomplete`, { q: data, limit: 10 }).pipe(map(r => r.data ?? []));
  }

  obtenerBomPorId(id: number) {
    return this._http.get(`${this.apiUrl}/api/mf/boms/${id}`);
  }
  editarBom(id: any, data: any) {
    return this._http.put(`${this.apiUrl}/api/mf/boms/${id}`, data);
  }
  anularBom(id: number) {
    return this._http.delete(`${this.apiUrl}/api/mf/boms/${id}`);
  }
  repgistarProducto(id: number) {
    return this._http.get(`${this.apiUrl}/api/mf/boms/registrar-producto/${id}`);
  }
}
