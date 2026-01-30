import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UbigeoService {
  private apiUrl = environment.apiUrlBase;
  private readonly _http = inject(HttpClient);
  listarDepartamentos() {
    return this._http.get(`${this.apiUrl}/pegasus/ubigeo/departamentos`);
  }
  listarProvincias(departamento: string) {
    return this._http.get(`${this.apiUrl}/pegasus/ubigeo/provincias/${departamento}`);
  }
  listarDistritos(provincia: string) {
    return this._http.get(`${this.apiUrl}/pegasus/ubigeo/distritos/${provincia}`);
  }
}
