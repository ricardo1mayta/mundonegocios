import { Rol } from './roles/rol';

export class Usuario {
  idUser!: number; // backend usa idUser
  username!: string;
  emailUser!: string;
  activo!: boolean;
  tipoUser!: string;
  idcodTipoUser!: number | null;
  idSede!: number;
  roles: Rol[] = []; // lista de roles
  nombres!: string;
  apellidos!: string;
  img!: string | null;
  password?: string;
}
