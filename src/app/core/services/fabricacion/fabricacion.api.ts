import { Injectable } from '@angular/core';
import { useApi } from './http';
import {
  BomCreateDTO,
  ConsumoCreateDTO,
  CotizacionCreateDTO,
  CotizacionDTO,
  MrpDTO,
  RecepcionCreateDTO,
  RequerimientoCreateDTO,
  RequerimientoDTO,
  RequisicionFromMrpDTO,
} from '../../models/fabricacion/fabricacion.models';

@Injectable({ providedIn: 'root' })
export class FabricacionApi {
  private api = useApi();

  crearRequerimiento(dto: RequerimientoCreateDTO) {
    return this.api.http.post<RequerimientoDTO>(`${this.api.base}/api/mf/requerimientos`, dto);
  }

  crearBom(dto: BomCreateDTO) {
    return this.api.http.post<number>(`${this.api.base}/api/mf/boms`, dto);
  }

  cotizar(dto: CotizacionCreateDTO) {
    return this.api.http.post<CotizacionDTO>(`${this.api.base}/api/mf/cotizaciones`, dto);
  }

  aprobarCotizacion(id: number) {
    return this.api.http.put<CotizacionDTO>(`${this.api.base}/api/mf/cotizaciones/${id}/aprobar`, {});
  }

  crearOP(idCotizacion: number, codigo: string, volumen: number) {
    const params = { idCotizacion, codigo, volumen };
    return this.api.http.post<number>(`${this.api.base}/api/mf/ops`, null, { params });
  }

  calcularMrp(idOp: number, idAlmacen: number) {
    const params = { idOp, idAlmacen };
    return this.api.http.post<MrpDTO>(`${this.api.base}/api/mf/mrp`, null, { params });
  }

  requisicionFromMrp(dto: RequisicionFromMrpDTO) {
    return this.api.http.post<number>(`${this.api.base}/api/mf/requisiciones/from-mrp`, dto);
  }

  registrarRecepcion(dto: RecepcionCreateDTO) {
    return this.api.http.post<number>(`${this.api.base}/api/mf/recepciones`, dto);
  }

  validarRecepcion(id: number) {
    return this.api.http.put<void>(`${this.api.base}/api/mf/recepciones/${id}/validar`, {});
  }

  registrarConsumo(dto: ConsumoCreateDTO) {
    return this.api.http.post<number>(`${this.api.base}/api/mf/consumos`, dto);
  }

  cerrarOp(id: number, lecciones?: string) {
    const params: any = {};
    if (lecciones) params.lecciones = lecciones;
    return this.api.http.put<void>(`${this.api.base}/api/mf/ops/${id}/cerrar`, {}, { params });
  }
}