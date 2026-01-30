import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { useApi } from './http';
import { InsumoCreateDTO, InsumoDTO } from '../../models/fabricacion/fabricacion.models';

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

@Injectable({ providedIn: 'root' })
export class InsumoApi {
  private api = useApi();

  crear(dto: InsumoCreateDTO) {
    return this.api.http.post<InsumoDTO>(`${this.api.base}/api/mf/insumos`, dto);
  }

  obtener(id: number) {
    return this.api.http.get<InsumoDTO>(`${this.api.base}/api/mf/insumos/${id}`);
  }

  buscar(q?: string, tipo?: string, activo?: boolean, page = 0, size = 10) {
    let params = new HttpParams().set('page', page).set('size', size);

    if (q) params = params.set('q', q);
    if (tipo) params = params.set('tipo', tipo);
    if (activo !== undefined) params = params.set('activo', String(activo));

    return this.api.http.get<Page<InsumoDTO>>(`${this.api.base}/api/mf/insumos`, { params });
  }
}
