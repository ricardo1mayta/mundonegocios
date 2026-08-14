import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class NumeracionService {
  private apiUrl = environment.apiUrlBase;
  private readonly http = inject(HttpClient);

  listarPorSede(idSede: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/pegasus/numeracion?idSede=${idSede}`);
  }

  obtener(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/pegasus/numeracion/${id}`);
  }

  crear(body: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/pegasus/numeracion`, body, { observe: "response" });
  }

  actualizar(id: number, body: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/pegasus/numeracion/${id}`, body, { observe: "response" });
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/pegasus/numeracion/${id}`, { observe: "response" });
  }
}