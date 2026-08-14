import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Categoria } from '../../models/almacen/categoria';

@Injectable({
  providedIn: 'root',
})
export class CateboriasService {
  private apiUrl = environment.apiUrlBase;
  private readonly _http = inject(HttpClient);

  get urlListarCategorias(): string {
    return `${this.apiUrl}/pegasus/categorias/consultar-paginado`;
  }

  listarCategorias() {
    return this._http.get(this.urlListarCategorias);
  }
  //agregar el crud de categorias
  crearCategoria(categoria: Categoria) {
    return this._http.post(`${this.apiUrl}/pegasus/categorias`, categoria);
  }
  editarCategoria(id: number, categoria: Categoria) {
    return this._http.put(`${this.apiUrl}/pegasus/categorias/${id}`, categoria);
  }
  eliminarCategoria(id: number) {
    return this._http.delete(`${this.apiUrl}/pegasus/categorias/${id}`);
  }
  //obtner todas las categorias
  obtenerTodasLasCategorias() {
    return this._http.get(`${this.apiUrl}/pegasus/categorias`);
  }
}