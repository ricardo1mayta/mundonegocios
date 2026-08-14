import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ImeisService {
  private apiUrl = environment.apiUrlBase;
  private readonly http = inject(HttpClient);

  // Registra IMEIs asociados a una compra y detalle
  registrarImeis(payload: { idCompra: number; idDetalle: number; idProducto?: number; imeis: string[] }) {
    return this.http.post(`${this.apiUrl}/pegasus/imeis`, payload);
  }

  // Lista IMEIs por compra
  listarPorCompra(idCompra: number) {
    return this.http.get(`${this.apiUrl}/pegasus/imeis/compra/${idCompra}`);
  }

  // Consulta IMEI para ver procedencia
  consultarImei(imei: string) {
    return this.http.get(`${this.apiUrl}/pegasus/imeis/${encodeURIComponent(imei)}`);
  }

  // Eliminar IMEI
  eliminarImei(imei: string) {
    return this.http.delete(`${this.apiUrl}/pegasus/imeis/${encodeURIComponent(imei)}`);
  }

  // Listar IMEIs disponibles por producto
  listarDisponiblesPorProducto(idProducto: number) {
    return this.http.get(`${this.apiUrl}/pegasus/imeis/disponibles/${idProducto}`);
  }

  // Asignar IMEIs a una venta
  asignarImeisVenta(payload: { idVenta: number; idDetalle: number; idCliente: number; imeis: string[] }) {
    return this.http.post(`${this.apiUrl}/pegasus/imeis/venta`, payload);
  }

  // Listar IMEIs asignados a una venta
  listarPorVenta(idVenta: number) {
    return this.http.get(`${this.apiUrl}/pegasus/imeis/venta/${idVenta}`);
  }

  // Desasignar IMEI de una venta (volver a disponible)
  eliminarImeiVenta(imei: string) {
    return this.http.delete(`${this.apiUrl}/pegasus/imeis/venta/${encodeURIComponent(imei)}`);
  }

  // Listar IMEIs despachados por detalle de venta
  listarDespachadosPorDetalle(idDetalle: number) {
    return this.http.get(`${this.apiUrl}/pegasus/imeis/venta/despachados/${idDetalle}`);
  }

  eliminarImeiDespachado(idDetalle: number, imei: string) {
    return this.http.delete(
      `${this.apiUrl}/pegasus/imeis/venta/despachados/${idDetalle}/${encodeURIComponent(imei)}`,
    );
  }
}