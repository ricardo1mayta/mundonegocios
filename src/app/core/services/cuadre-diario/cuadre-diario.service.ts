import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class CuadreDiarioService {
  private apiUrl = environment.apiUrlBase;
  private readonly http = inject(HttpClient);

  getCuadre(fecha: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/pegasus/cuadre-diario?fecha=${fecha}`);
  }

  listarRango(desde: string, hasta: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/pegasus/cuadre-diario?desde=${desde}&hasta=${hasta}`);
  }

  getVentas(fecha: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/pegasus/cuadre-diario/ventas?fecha=${fecha}`);
  }

  getCompras(fecha: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/pegasus/cuadre-diario/compras?fecha=${fecha}`);
  }

  getGastos(fecha: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/pegasus/cuadre-diario/gastos?fecha=${fecha}`);
  }

  crearCuadre(body: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/pegasus/cuadre-diario`, body, { observe: "response" });
  }

  actualizarCuadre(id: number, body: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/pegasus/cuadre-diario/${id}`, body, { observe: "response" });
  }
}