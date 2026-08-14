import { Producto } from './producto';

export class ProductosDetalle {
  cantidad!: number;
  id!: number;
  idsede!: number;
  metodo!: string;
  minimo!: number;
  preciocompra!: number;
  precioventa!: number;
  producto!: Producto;
  statusdet!: boolean;
  statusweb!: boolean;
}