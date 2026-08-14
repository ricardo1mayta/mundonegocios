import { Injectable, signal } from "@angular/core";
import { IPermisosRuta, IPermisoBoton } from "../../models/generic/general.model";

@Injectable({ providedIn: "root" })
export class RutaService {
  public permisosActuales = signal<IPermisoBoton[]>([]);
  public permisos = signal<IPermisosRuta>({
    puedeCrear: true,
    puedeExportar: true,
  } as any);

  setPermisosRuta(p: Partial<IPermisosRuta>) {
    this.permisos.update((curr) => ({ ...curr, ...p }) as any);
  }

  setPermisosActuales(permisos: IPermisoBoton[]) {
    this.permisosActuales.set(permisos ?? []);
  }

  obtenerPermisoBoton(nombreBoton: string): boolean {
    const nombre = (nombreBoton ?? "").trim().toLowerCase();
    if (!nombre) return false;
    return this.permisosActuales().some((permiso) => (permiso?.nombreOpcion ?? "").trim().toLowerCase() === nombre);
  }
}