export interface IEstadoRespuesta {
    code: string;
    status: string;
    message: string;
}

export interface IRespuestaApi<T> {
    status: IEstadoRespuesta;
    data: T;
}

export interface IUnidadOrganica {
    id: number | null;
    nombre: string;
    nombreCorto: string;
    sigla: string;
    idTipoNivel: number | null;
    idUnidadOrganicaPadre: number | null;
    indActivo: boolean | null;
}

export interface IDatoInvitado {
    nombre: string;
    correo: string;
    codigo?: string;
}

export interface ICodigoVerificacionRequest {
    id?: number;
    idUsuario: number | null;
    nombres?: string;
    idPaisCelular?: number;
    celular?: string | null;
    correo: string;
    codigo?: string | null;
    idSituacionCodVeri: number | null;
    indEstado?: boolean | null;
    origen: number;
}

export interface ITipoDocumentoPersona {
    idTipo: number;
    idTipoPadre: number;
    nomTipo: string;
    desTipo: string;
    desCorta: string;
    indActivo: number;
}

export interface ICodigoVerficacionValida {
    idUsuario?: number;
    correo: string;
    codigo: string;
    origen: number;
}

export interface ICodigoVerficacionValidaResponse {
    id: number;
    fechaExpiracion: string;
    indEstado: string;
    esValido: boolean;
}

export interface ICodigoVerficacionValidaInvitadoResponse {
    id: number;
    fechaExpiracion: string;
    indEstado: string;
    esValido: boolean;
    key: string;
}

export interface IInformacionNavegadorCliente {
    ip: string;
    city: string;
    region: string;
    country: string;
    loc: string;
    org: string;
    postal: string;
    timezone: string;
    readme: string;
}

export interface IOpcionMenu {
    idMenuAplicacion: number;
    idMenuAplicacionPadre: number;
    codigoMenu: string;
    nombreMenu: string;
    rutaMenu: string;
    ordenMenu: string;
    iconoMenu?: string;
}

export interface IPermisoBoton {
    idOpcionMenu: number;
    nombreOpcion: string;
    descripcionOpcion: string;
}

export interface IPermisosRuta {
    puedeCrear?: boolean;
    puedeVer?: boolean;
    puedeEditar?: boolean;
    puedeEliminar?: boolean;
    puedeExportar?: boolean;
    puedeActivar?: boolean;
}
