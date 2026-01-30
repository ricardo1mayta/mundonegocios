import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Rol } from '../../models/roles/rol';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  private readonly apiUrl = environment.apiUrlBase;
  private readonly _http = inject(HttpClient);

  /** URL del endpoint paginado */
  get urlListarRoles(): string {
    return `${this.apiUrl}/pegasus/roles/consultar-paginado`;
  }

  /** Listado paginado (envía filtros o {} si no se requieren) */
  listarRoles(params: any = {}) {
    return this._http.post(this.urlListarRoles, params);
  }

  /** CRUD */
  crearRol(rol: Rol) {
    return this._http.post(`${this.apiUrl}/pegasus/roles`, rol);
  }

  editarRol(idRol: number, rol: Rol) {
    return this._http.put(`${this.apiUrl}/pegasus/roles/${idRol}`, rol);
  }

  eliminarRol(idRol: number) {
    /* Backend marca baja lógica con PATCH */
    return this._http.delete(`${this.apiUrl}/pegasus/roles/${idRol}`);
  }

  /** Listado sin paginación */
  obtenerTodosLosRoles() {
    return this._http.get(`${this.apiUrl}/pegasus/roles`);
  }
}
