import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Usuario } from '../../models/usuario';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private readonly apiUrl = environment.apiUrlBase;
  private readonly _http = inject(HttpClient);

  /* --- ENDPOINTS ---------------------------------------------------- */

  /** URL del paginado */
  get urlListarUsuarios(): string {
    return `${this.apiUrl}/pegasus/usuarios/consultar-paginado`;
  }

  /** Listado paginado (envía filtros o {} si no se necesitan) */
  listarUsuarios(params: any = {}) {
    return this._http.post(this.urlListarUsuarios, params);
  }

  /** Devuelve un usuario por ID (para edición) */
  obtenerUsuario(id: number) {
    return this._http.get<Usuario>(`${this.apiUrl}/pegasus/usuarios/${id}`);
  }

  /** Listado sin paginación (por ejemplo, para combos) */
  obtenerTodosLosUsuarios() {
    return this._http.get<Usuario[]>(`${this.apiUrl}/pegasus/usuarios`);
  }

  /* --- CRUD --------------------------------------------------------- */

  crearUsuario(usuario: Partial<Usuario>) {
    return this._http.post(`${this.apiUrl}/pegasus/usuarios`, usuario);
  }

  editarUsuario(id: number, usuario: Partial<Usuario>) {
    return this._http.put(`${this.apiUrl}/pegasus/usuarios/${id}`, usuario);
  }

  /** Eliminación lógica (PATCH) o DELETE según tu backend */
  eliminarUsuario(id: number) {
    return this._http.delete(`${this.apiUrl}/pegasus/usuarios/${id}`);
  }
}


