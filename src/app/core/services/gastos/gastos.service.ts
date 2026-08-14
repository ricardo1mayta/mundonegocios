import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class GastosService {
  private apiUrl = environment.apiUrlBase;
  private readonly http = inject(HttpClient);

  listarPorFecha(fecha: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/pegasus/gastos?fecha=${fecha}`);
  }

  obtenerDetalle(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/pegasus/gastos/${id}`);
  }

  crear(body: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/pegasus/gastos`, body, { observe: "response" });
  }

  actualizar(id: number, body: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/pegasus/gastos/${id}`, body, { observe: "response" });
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/pegasus/gastos/${id}`, { observe: "response" });
  }
}