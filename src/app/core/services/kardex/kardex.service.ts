import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class KardexService {
  private readonly apiUrl = environment.apiUrlBase;
  private readonly http = inject(HttpClient);

  getPorDetalle(iddet: number) {
    return this.http.get(`${this.apiUrl}/pegasus/kardex-producto/iddet/${iddet}`);
  }

  getPorProducto(idpro: number, idsede: number) {
    const params = new HttpParams().set("idsede", String(idsede));
    return this.http.get(`${this.apiUrl}/pegasus/kardex-producto/producto/${idpro}`, { params });
  }

  getPorDocumento(referencia: string, idReferencia: number) {
    const params = new HttpParams().set("referencia", referencia).set("idReferencia", String(idReferencia));
    return this.http.get(`${this.apiUrl}/pegasus/kardex-producto/documento`, { params });
  }

  getPorRango(params: { desde: string; hasta: string; idsede?: number | null; idpro?: number | null }) {
    let query = new HttpParams().set("desde", params.desde).set("hasta", params.hasta);

    if (params.idsede != null) {
      query = query.set("idsede", String(params.idsede));
    }

    if (params.idpro != null) {
      query = query.set("idpro", String(params.idpro));
    }

    return this.http.get(`${this.apiUrl}/pegasus/kardex-producto`, { params: query });
  }
}