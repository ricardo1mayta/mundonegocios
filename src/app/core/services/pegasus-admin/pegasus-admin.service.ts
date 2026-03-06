import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map } from "rxjs";
import { environment } from "../../../../environments/environment";

export interface PegasusSistemaPayload {
  nombreSis: string;
  descripcionSis: string;
  flgActivoSis: boolean;
}

export interface PegasusMenuPayload {
  obraItem: string | null;
  idModulo: string;
  idSistema: number;
  name: string;
  icon: string;
  routeOrFunction: string;
  routeOrFunction2: string | null;
  idPadreItem: number;
  position: number;
  pathMatchExact: boolean;
  badge: string | null;
  badgeColor: string | null;
  type: string | null;
  customClass: string | null;
}

@Injectable({
  providedIn: "root",
})
export class PegasusAdminService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrlBase;

  listarSistemas() {
    return this.http.get<unknown>(`${this.apiUrl}/pegasus/sistemas`).pipe(map((response) => this.unwrapData(response)));
  }

  crearSistema(payload: PegasusSistemaPayload) {
    return this.http.post(`${this.apiUrl}/pegasus/sistemas`, payload);
  }

  actualizarSistema(idSistema: number, payload: PegasusSistemaPayload) {
    return this.http.put(`${this.apiUrl}/pegasus/sistemas/${idSistema}`, payload);
  }

  listarMenuPorSistema(idSistema: number) {
    return this.http
      .get<unknown>(`${this.apiUrl}/pegasus/menu`, {
        params: {
          sistemaId: idSistema,
        },
      })
      .pipe(map((response) => this.unwrapData(response)));
  }

  crearMenu(payload: PegasusMenuPayload) {
    return this.http.post(`${this.apiUrl}/pegasus/menu`, payload);
  }

  actualizarMenu(idItem: number, payload: PegasusMenuPayload) {
    return this.http.put(`${this.apiUrl}/pegasus/menu/${idItem}`, payload);
  }

  private unwrapData<T>(response: T | { data?: T }): T {
    if (response && typeof response === "object" && "data" in response) {
      const wrapped = response as { data?: T };
      return (wrapped.data ?? response) as T;
    }

    return response as T;
  }
}