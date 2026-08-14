import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ComprasService {
  private apiUrl = environment.apiUrlBase;
  private readonly _http = inject(HttpClient);

  get urlListaCompras(): string {
    return `${this.apiUrl}/pegasus/compras/consultar-paginado`;
  }

  //agregar registrar compra
  registrarCompra(data: any) {
    return this._http.post(`${this.apiUrl}/pegasus/compras`, data);
  }

  obtenerCompraPorId(id: number) {
    return this._http.get(`${this.apiUrl}/pegasus/compras/${id}`);
  }
  editarCompra(id: any, data: any) {
    return this._http.put(`${this.apiUrl}/pegasus/compras/${id}`, data);
  }
  anularCompra(id: number) {
    return this._http.delete(`${this.apiUrl}/pegasus/compras/${id}`);
  }
}