import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class InventarioService {
  private apiUrl = environment.apiUrlBase;
  private readonly _http = inject(HttpClient);

  get urlListaProductos(): string {
    return `${this.apiUrl}/pegasus/inventario-sede/consultar-paginado`;
  }
  get urlListaProductosDisponibles(): string {
    return `${this.apiUrl}/pegasus/inventario-sede/disponible/consultar-paginado`;
  }
  urlStockProductos(id: number): string {
    return `${this.apiUrl}/pegasus/inventario-sede/consultar-stock/${id}`;
  }

  // agrgar la lógica del servicio aquí
  listaInventario() {
    return this._http.get(this.urlListaProductos);
  }
  actualizarInventario(id: number, data: any) {
    return this._http.put(`${this.apiUrl}/pegasus/inventario-sede/${id}`, data);
  }

  // agregar servicio que trae todos los productos /pegasus/inventario-sede
  listaProductos() {
    return this._http.get(`${this.apiUrl}/pegasus/inventario-sede`);
  }
  listaProductosDisponibles() {
    return this._http.get(`${this.apiUrl}/pegasus/inventario-sede/disponible`);
  }
  //agregar servicio que trae el stock de un producto
  stockProductos(id: number) {
    return this._http.get(`${this.apiUrl}/pegasus/inventario-sede/consultar-stock/${id}`);
  }
  actualizarStock(id: number, data: any) {
    return this._http.put(`${this.apiUrl}/pegasus/inventario-sede/actualizar-stock/${id}`, data);
  }
}
