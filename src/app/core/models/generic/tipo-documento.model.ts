export interface TipoDocumento {
    idTipo: number;
    nombreTipo: string;
    descripcionTipo: string;
    descripcionCorta: string;
}

export interface ResponseApi {
    listaParametros: TipoDocumento[];
    totalPaginas: number;
    totalElemento: number;
}

export interface DocumentoUsuario {
    uuidPersona: string;
    tipoDoc: number;
    numeroDoc: string;
    descDoc: string;
    nombres: string;
    apellidoPat: string;
    apellidoMat: string;
}