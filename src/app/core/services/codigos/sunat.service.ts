import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SunatService {
  private apiUrl = environment.apiUrlBase;
  private readonly _http = inject(HttpClient);
  getPersonaReniec(numero: string) {
    return this._http.get(`${this.apiUrl}/pegasus/utilitario/consulta/dni/${numero}`);
  }
  getEmpresaSunat(numero: string) {
    return this._http.get(`${this.apiUrl}/pegasus/utilitario/consulta/ruc/${numero}`);
  }
}