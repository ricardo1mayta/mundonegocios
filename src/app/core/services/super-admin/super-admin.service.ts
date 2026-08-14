import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class SuperAdminService {
  private apiUrl = environment.apiUrlBase;
  private readonly http = inject(HttpClient);

  get urlSedesPadre(): string {
    return `${this.apiUrl}/pegasus/sedes-padre/consultar-paginado`;
  }

  get urlSedesHijas(): string {
    return `${this.apiUrl}/pegasus/admin/sedes/consultar-paginado`;
  }

  get urlUsuarios(): string {
    return `${this.apiUrl}/pegasus/usuarios/consultar-paginado-all`;
  }

  listarSedesPadre(): Observable<any> {
    return this.http.post(this.urlSedesPadre, { datos: {}, pagina: 0, tamanio: 1000 });
  }

  listarSedesPadrePaginado(params: any): Observable<any> {
    return this.http.post(this.urlSedesPadre, params ?? { datos: {}, pagina: 0, tamanio: 10 });
  }

  actualizarSedePadre(id: number, body: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/pegasus/sedes-padre/${id}`, body, { observe: "response" });
  }

  listarSedesHijas(idSedePadre: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/pegasus/admin/sedes?idSedePadre=${idSedePadre}`);
  }

  listarSedesHijasPaginado(params: any): Observable<any> {
    return this.http.post(this.urlSedesHijas, params ?? { datos: {}, pagina: 0, tamanio: 10 });
  }

  crearSedeHija(idSedePadre: number, body: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/pegasus/admin/sedes?idSedePadre=${idSedePadre}`, body, {
      observe: "response",
    });
  }

  actualizarSedeHija(id: number, body: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/pegasus/admin/sedes/${id}`, body, { observe: "response" });
  }

  crearUsuario(body: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/pegasus/admin/usuarios`, body, { observe: "response" });
  }

  listarUsuariosPaginado(params: any): Observable<any> {
    return this.http.post(this.urlUsuarios, params ?? { datos: {}, pagina: 0, tamanio: 10 });
  }
}