import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MenuNode } from "../../models/menu/menu-node";
import { environment } from "../../../../environments/environment";
export interface MenuItem {
  idItem: number;
  name: string;
  routeOrFunction: string | null;
  icon: string | null;
  idPadreItem: number | null;
  type: string;
  position: number;
  children: MenuItem[];
}
@Injectable({
  providedIn: "root",
})
export class MenuRolService {
  private readonly API_URL = `${environment.apiUrlBase}/pegasus/sidenav`; // ajusta la URL si es distinta

  constructor(private http: HttpClient) {}

  getMenu(idRol: number, idSede: number) {
    return this.http.get<MenuNode[]>(`${this.API_URL}/menurolsede`);
  }
  getMenuNew(idRol: number, idSede: number) {
    return this.http.get<MenuNode[]>(`${this.API_URL}/menurolsede2`);
  }
  getItemsByRol(rolId: number) {
    return this.http.get<number[]>(`${this.API_URL}/menurol/${rolId}`);
  }

  guardarAsignacion(dto: any) {
    return this.http.post(`${this.API_URL}/agregar-menu-rol`, dto);
  }
}
