import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Sede } from '../../models/sedes/sedes';

@Injectable({
  providedIn: 'root',
})
export class SedesService {
  private readonly apiUrl = environment.apiUrlBase;
  private readonly _http = inject(HttpClient);

  /** URL de la consulta paginada */
  get urlListarSedes(): string {
    return `${this.apiUrl}/pegasus/sedes/consultar-paginado`;
  }

  /** Listado paginado (POST o GET según tu backend) */
  listarSedes(params?: any) {
    return this._http.post(this.urlListarSedes, params ?? {});
  }

  /** CRUD completo */
  crearSede(sede: Sede) {
    return this._http.post(`${this.apiUrl}/pegasus/sedes`, sede);
  }

  editarSede(id: number, sede: Sede) {
    return this._http.put(`${this.apiUrl}/pegasus/sedes/${id}`, sede);
  }

  eliminarSede(id: number) {
    return this._http.delete(`${this.apiUrl}/pegasus/sedes/${id}`);
  }

  /** Listado sin paginación */
  obtenerTodasLasSedes() {
    return this._http.get(`${this.apiUrl}/pegasus/sedes`);
  }
  /** Obtener una sede por ID */
  obtenerSede(id: number) {
    return this._http.get<Sede>(`${this.apiUrl}/pegasus/sedes/${id}`);
  }
}
