import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Producto } from '../../models/almacen/producto';

@Injectable({
  providedIn: 'root',
})
export class ProductosService {
  private apiUrl = environment.apiUrlBase;
  private readonly _http = inject(HttpClient);

  get urlListaProductos(): string {
    return `${this.apiUrl}/pegasus/productos/consultar-paginado`;
  }

  listaProductos() {
    return this._http.get(this.urlListaProductos);
  }
  //agregar el crud de categorias
  crearProducto(producto: Producto) {
    return this._http.post(`${this.apiUrl}/pegasus/productos`, producto);
  }
  editarProducto(id: number, producto: Producto) {
    return this._http.put(`${this.apiUrl}/pegasus/productos/${id}`, producto);
  }
  eliminarProducto(id: number) {
    return this._http.delete(`${this.apiUrl}/pegasus/productos/${id}`);
  }
}