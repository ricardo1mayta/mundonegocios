import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { environment } from "../../../../environments/environment";

export type NotificationItem = {
  id: string | number;
  mensaje: string;
  fecha: string | number;
  icon?: string | null;
  read?: boolean;
  raw?: any;
};

@Injectable({ providedIn: "root" })
export class NotificationsApi {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrlBase;

  listar(sedeId: number, limit = 20): Observable<NotificationItem[]> {
    const url = `${this.apiUrl}/pegasus/notificacionesInternas/listar?&limit=${limit}`;
    return this.http.get<any>(url).pipe(
      map((res) => {
        const data = res?.data ?? res ?? [];
        const list = Array.isArray(data) ? data : [];
        return list.map((n: any) => ({
          id: n?.id ?? n?.idNotificacion ?? n?.id_notificacion ?? n?.codigo ?? n?.uuid ?? n?.fecha ?? Math.random(),
          mensaje: n?.mensaje ?? n?.message ?? n?.titulo ?? "Notificación",
          fecha: n?.fecha ?? n?.createdAt ?? n?.created_at ?? n?.fechaRegistro ?? new Date().toISOString(),
          icon: n?.icon ?? n?.tipo ?? null,
          raw: n,
        }));
      }),
    );
  }
}
