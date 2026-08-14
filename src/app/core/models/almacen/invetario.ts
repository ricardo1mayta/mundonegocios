// crear la clase Inventario
export class Inventario {
  id!: number;
  idpro!: number;
  nombreProducto!: string;
  imagen!: string;
  marca!: string | null;
  categoria!: string;
  codigo!: string;
  cantidad!: number;
  idsede!: number;
  statusdet!: boolean;
  preciocompra!: number;
  precioventa!: number;
  minimo!: number;
  metodo!: string;
  preciooferta!: number | null;
  preciocliente!: number | null;
  preciomayor!: number | null;
  statusweb!: boolean;
  statusoff!: boolean;
  vistas!: number;
  lotesproductos!: any[]; // Assuming this is an array of objects, you can define a specific type if needed
}