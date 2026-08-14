// core/services/fabricacion/ficha-tecnica.api.ts
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { useApi } from './http';
@Injectable({ providedIn: 'root' })
export class FichaTecnicaApi {
  private http = inject(HttpClient);
  private api = useApi();

  crear(dto: any) {
    return this.http.post<any>(`${this.api.base}/api/mf/fichas-tecnicas`, dto);
  }

  actualizar(id: number, dto: any) {
    return this.http.put<any>(`${this.api.base}/api/mf/fichas-tecnicas/${id}`, dto);
  }

  obtener(id: number) {
    return this.http.get<any>(`${this.api.base}/api/mf/fichas-tecnicas/${id}`);
  }

  aprobar(id: number) {
    return this.http.put<any>(`${this.api.base}/api/mf/fichas-tecnicas/${id}/aprobar`, {});
  }

  buscar(params: any) {
    return this.http.get<any>(`${this.api.base}/api/mf/fichas-tecnicas`, { params });
  }
}