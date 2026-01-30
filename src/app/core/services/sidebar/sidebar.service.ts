import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private apiUrl = environment.apiUrlBase;

  private readonly _http = inject(HttpClient);
  get urlConsultarDatosUsuario(): string {
    return `${this.apiUrl}/pegasus/usuarios/datosusuario`;
  }
  // Método para obtener los datos del usuario get
  getDatosUsuario(): Observable<any> {
    return this._http.get<any[]>(`${this.apiUrl}/pegasus/usuarios/datosusuario`);
  }
}
