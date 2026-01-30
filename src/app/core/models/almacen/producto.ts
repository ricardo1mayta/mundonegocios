import { Categoria } from './categoria';
import { Marca } from './marca';

export interface Producto {
  id: number;
  descripcion: string;
  categoria: Categoria;
  imagen: string;
  preciocompra: number | null;
  preciounitario: number | null;
  codigo: string;
  idCodigo: number | null;
  sku: string;
  medida: string;
  tipoafetacion: string;
  adddate: string | null;
  idusercreate: number | null;
  editdate: string | null;
  iduserupdate: number | null;
  status: boolean;
  sede: number;
  precio1: number | null;
  precio2: number | null;
  precio3: number | null;
  descc: string;
  descl: string;
  img1: string;
  img2: string;
  img3: string;
  img4: string;
  statuspublic: string;
  statusoff: boolean;
  marca: Marca;
  sedeReg: number;
}
