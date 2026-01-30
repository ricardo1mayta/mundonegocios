import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EstadosService {
  private apiUrl = environment.apiUrlBase;
  private readonly _http = inject(HttpClient);
  listarEstados(tipo: String) {
    return this._http.get(`${this.apiUrl}/pegasus/estados/${tipo}`);
  }
}
