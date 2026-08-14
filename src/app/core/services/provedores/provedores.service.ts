import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProvedoresService {
  private apiUrl = environment.apiUrlBase;

  private readonly _http = inject(HttpClient);
  get urlConsultarPedidos(): string {
    return `${this.apiUrl}/pegasus/provedores/consultar-paginado`;
  }

  // agregar listar provedores
  listarProvedores() {
    return this._http.get<any>(`${this.apiUrl}/pegasus/provedores`);
  }
  registrarProvedor(provedor: any) {
    return this._http.post(`${this.apiUrl}/pegasus/provedores`, provedor);
  }
  actualizarProvedor(id: number | string, provedor: any) {
    return this._http.put(`${this.apiUrl}/pegasus/provedores/${id}`, provedor);
  }
  obtenerProvedorPorId(id: number | string) {
    return this._http.get(`${this.apiUrl}/pegasus/provedores/${id}`);
  }
  eliminarProvedor(id: number | string) {
    return this._http.delete(`${this.apiUrl}/pegasus/provedores/${id}`);
  }
}