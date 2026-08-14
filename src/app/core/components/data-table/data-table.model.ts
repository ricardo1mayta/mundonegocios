import { IFormato } from "../../models/excel/excel.model";

export interface IEventoBoton {
  datos: any;
  indiceFila: number;
}

export interface IDatosPaginacion {
  pagina?: number;
  tamanio?: number;
  campoOrdernamiento?: string;
  orden?: number;
}

export interface IListaPaginadaPeticion<T> extends IDatosPaginacion {
  datos?: T;
}

export interface IListaPaginada<T> {
  lista?: T[];
  totalRegistrosPagina: number;
  totalRegistros: number;
  totalPaginas: number;
  paginaActual: number;
}

export interface IEventoCheck {
  fila: any;
  seleccionado: boolean;
  filasSeleccionadas: any[];
}

export interface IColumnaReporteExcel {
  titulo: string;
  propiedad?: string;
  fn?: (elemento?: any) => any;
  ancho?: number;
  esFecha?: boolean;
  formatoFecha?: string;
  esEstado?: boolean;
  formato?: IFormato;
}

export interface IReporteExcel {
  titulo: string;
  fuente?: string;
  columnas: IColumnaReporteExcel[];
}