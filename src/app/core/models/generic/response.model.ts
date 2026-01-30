export interface ResponseGenericoOut {
    id: string;
    fechaReg: string;
    fechaMod: string;
}

export interface ResponseArchivoOut {
    id: string;
    nombre: string;
}

export interface mensajeT01 {
    idMensaje: string;
    idNorma: number;
    desNorma: string;
    idApp: number;
    msjePrincipal: string;
    msjeConfirmacion: string | null;
    idFormato: number;
    desFormato: string;
    indActivo: number;
}

export interface resultadoT01 {
    codigo: string;
    mensaje: string;
    nivel: number;
    mensajes: {
        data: any | null;
    };
}

export interface ResultadoConsentimiento {
    mensajeT01: mensajeT01;
    resultadoT01: resultadoT01;
}

export interface DatoConsentimiento {
    idMensaje: number;
    codigoTramite?: string;
    idDocIdentidad: number;
    docIdentidad: string;
    codUsuario?: string;
    usuCrea: string;
    ipCrea: string;
}

export interface DataEnviaConsentimiento {
    idMensaje: string;
    codigoTramite: string;
    idDocIdentidad: number;
    docIdentidad: string;
    codUsuario: string;
    usuCrea: string;
    ipCrea: string;
}

export interface IResultadoAceptarConsentimiento {
    status?: string;
    message?: string;
    resultadoT01: resultadoT01;
}
