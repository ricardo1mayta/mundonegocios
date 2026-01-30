import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MarcasService {
  private apiUrl = environment.apiUrlBase;
  private readonly _http = inject(HttpClient);

  get urlListarMarcas(): string {
    return `${this.apiUrl}/pegasus/marcas/consultar-paginado`;
  }

  listarMarcas() {
    return this._http.get(this.urlListarMarcas);
  }
  crear(marca: any) {
    return this._http.post(`${this.apiUrl}/pegasus/marcas`, marca);
  }
  actualizar(id: number, marca: any) {
    return this._http.put(`${this.apiUrl}/pegasus/marcas/${id}`, marca);
  }
  eliminar(id: number) {
    return this._http.delete(`${this.apiUrl}/pegasus/marcas/${id}`);
  }
  obtenerTodasLasMarcas() {
    return this._http.get<any[]>(`${this.apiUrl}/pegasus/marcas`);
  }
}
