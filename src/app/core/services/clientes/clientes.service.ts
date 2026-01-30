import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ClientesService {
  private apiUrl = environment.apiUrlBase;

  private readonly _http = inject(HttpClient);
  get urlConsultarPedidos(): string {
    return `${this.apiUrl}/pegasus/clientes/consultar-paginado`;
  }

  listarClientes() {
    return this._http.get(`${this.apiUrl}/pegasus/clientes`);
  }
  registrarCliente(cliente: any) {
    return this._http.post(`${this.apiUrl}/pegasus/clientes`, cliente);
  }
  actualizarCliente(id: any, cliente: any) {
    return this._http.put(`${this.apiUrl}/pegasus/clientes/${id}`, cliente);
  }
  optenerClientePorId(id: any) {
    return this._http.get(`${this.apiUrl}/pegasus/clientes/${id}`);
  }

  eliminarCliente(id: any) {
    return this._http.delete(`${this.apiUrl}/pegasus/clientes/${id}`);
  }
}
