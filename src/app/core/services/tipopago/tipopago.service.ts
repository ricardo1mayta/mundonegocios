import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TipopagoService {
  private apiUrl = environment.apiUrlBase;
  private readonly _http = inject(HttpClient);
  listarTiposPago() {
    return this._http.get(`${this.apiUrl}/pegasus/tipos-pago`);
  }
}