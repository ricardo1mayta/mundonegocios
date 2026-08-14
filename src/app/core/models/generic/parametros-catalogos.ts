export interface ParametrosCatalogos {
    idTipo: number;
    idTipoPadre: number;
    nombreTipo: string;
    descripcionTipo: string;
    descripcionCorta: string;
    indicadorActivo: number;
}

export interface IPersonaNatural {
    uuIdPersona: string;
    nombrePersona: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    generoPersona: number;
    tipoDocumento: number;
    numeroDocumento: string;
    origenTipoDato: number;
    flagEstadoPersona: number;
    idOrigen: number;
    indicadorActivo: number;
    descTipoDocumento: string;
}

export interface IPersonaNaturalReniec {
    numeroDni: string;
    digitoVerificador: string;
    codigoUnicoDni: string;
    nombresPersona: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    apellidoCasada: string;
    fechaNacimiento: string;
    direccion: string;
    generoPersona: string;
    descripcionGenero: string;
    ubigeoDomicilio: string;
    codigoUbigeoDepa: string;
    codigoUbigeoProv: string;
    codigoUbigeoDis: string;
    nombreUbigeoDepa: string;
    nombreUbigeoProv: string;
    nombreUbigeoDist: string;
    estadoCivil: string;
    descripcionEstadoCivil: string;
    estaturaCentimetros: string;
    estaturaMetros: string;
    constanciaVotacion: string;
    ubigeoNacimiento: string;
    codigoUbigeoDepaNac: string;
    codigoUbigeoProvNac: string;
    codigoUbigeoDisNac: string;
    nombreUbigeoDepaNac: string;
    nombreUbigeoProvNac: string;
    nombreUbigeoDisNac: string;
    fechaEmision: string;
    fechaInscripcion: string;
    nombrePadre: string;
    nombreMadre: string;
    codigoGradoInstruccion: string;
    nombreGradoInstruccion: string;
    codigoRestriccion: string;
    nombreRestriccion: string;
    codigoRespuesta: string;
    mensajeRespuesta: string;
}

export interface IPersonaMigraciones {
    paiNacionalidad: string;
    numCe: string;
    fecInscripcion: string;
    fecEmision: string;
    fecCaducidad: string;
    fecVenResidencia: string;
    apePaterno: string;
    apeMaterno: string;
    nombres: string;
    ofiMigratoria: string;
    fecNacimiento: string;
    paiNacimiento: string;
    ubiActual: string;
    domActual: string;
    numPasaporte: string;
    estCivil: string;
    genero: string;
    calMigratoria: string;
}

export interface IRequestRegistrarPersona {
    nombrePersona: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    apellidoCasada: string;
    estadoCivil: number;
    generoPersona: number;
    fechaNacimiento: string;
    tipoDocumento: number;
    numeroDocumento: string;
    origenTipoDato: number;
    flagEstadoPersona: number;
    indicadorOrigen: number;
    indicadorActivo: number;
    usuarioCreacion: string;
    ipCreacion: string;
}

export interface IParametrosCatalogosTipoRequest {
    idAplicativo: number;
    idFormulario: number;
    idTipoNombre: number;
}

export interface IParametrosCatalogosRequest {
    idTipoNombre: number;
    idTipo?: number;
    descripcionTipo?: string;
    indicadorActivo: boolean;
}

export interface IPersonaDatosBasicosReniec {
    numeroDoc: string;
    nombresPersona: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    fechaEmisionValido: boolean;
}