import { ParametrosCatalogos } from './parametros-catalogos';

/*export interface Pais {
  idTipo: number;
  idTipoPadre: number;
  nomTipo: string;
  desTipo: string;
  desCorta: string;
  indActivo: number;
}*/

export interface ResponseApi {
    listaParametros: ParametrosCatalogos[];
    totalPaginas: number;
    totalElemento: number;
}