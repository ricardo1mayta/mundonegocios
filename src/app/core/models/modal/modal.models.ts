export interface IConfiguracionModal {
    titulo?: string;
    mensaje: string;
    tipo?: 'info' | 'error' | 'warning' | 'success' | 'question' | 'custom';
    icono?: string;
    datosRetorno?: any;
    mostrarAceptar?: boolean;
    textoAceptar?: string;
    mostrarNo?: boolean;
    textoNo?: string;
    mostrarCancelar?: boolean;
    textoCancelar?: string;
}