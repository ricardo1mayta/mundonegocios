import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private apiUrl = environment.apiUrlBase;

  private readonly _http = inject(HttpClient);
  listarMenu() {
    return this._http.get<any>(`${this.apiUrl}/pegasus/menu`).pipe(map(r => r.data));
  }
}
