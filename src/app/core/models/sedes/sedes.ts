export class Sede {
  id!: number;
  ruc!: string;
  tipoDoc!: string;
  nomComercial!: string;
  razonSocial!: string;
  codigoUbigeo!: string;
  direccion!: string;
  direccionDepartamento!: string;
  direccionProvincia!: string;
  direccionDistrito!: string;
  direccionCodigopais!: string;
  usuariosol!: string;
  status!: string; // 'A' / 'I'
  vigenciaInicio!: string | null; // yyyy-MM-dd
  vigenciaFin!: string | null;
  addDate!: string;
  addUs!: number | null;
  tipoProceso!: number | null;
  logoImpresion!: string | null;
  telefono!: string | null;
  info!: string | null;
  info2!: string | null;
  direccion2!: string | null;
  parent!: number | null;
  zonaneutro!: number | null;
  facAuto!: number | null;
  idpadre!: number | null;
  textogarantia!: string | null;
  titulotiket!: string | null;
  nombresede!: string;
  publicaenweb!: boolean;
  imagen!: string | null;
  tipo!: string;
}