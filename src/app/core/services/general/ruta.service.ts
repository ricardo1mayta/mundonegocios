import { inject, Injectable, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import {
  IPermisoBoton,
  IPermisosRuta,
} from '../../models/generic/general.model';

@Injectable({
  providedIn: 'root',
})
export class RutaService {
  private router = inject(Router);
  //private usuarioExternoService = inject(UsuarioExternoService);
  public permisosActuales = signal<IPermisoBoton[]>([]);
  public permisos = signal<IPermisosRuta>({});

  obtenerPermisoBoton(codigoBoton: string) {
    if (!this.permisosActuales()?.length) {
      return true;
    }

    return this.permisosActuales().some(
      (permiso) => permiso.nombreOpcion === codigoBoton
    );
  }
}
