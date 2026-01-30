export interface IFormato {
    color?: string;
    fondo?: string;
    negrita?: boolean;
    fuente?: string;
    tamanioLetra?: number;
    colorBorde?: string;
    estiloBorde?: 'thin' | 'medium' | 'thick';
    alineacionHorizontal?: 'center' | 'left' | 'right';
    alineacionVertical?: 'center' | 'top' | 'bottom';
}

export interface ICelda {
    ubicacion: string; //ejemplo: A2
    contenido: any;
    formato?: IFormato;
}

export interface IFila {
    indiceFila: number; //zero-base
    columnaInicial: number; //zero-base
    contenido: any[];
    altura?: number;
    formato?: IFormato;
}

export interface IColumna {
    indiceColumna: number; //zero-base
    filaInicial: number; //zero-base
    contenido: any[];
    ancho?: number;
    formato?: IFormato;
}

export interface IMatriz {
    filaInicial: number; //zero-base
    columnaInicial: number; //zero-base
    encabezados: any[];
    contenido: any[][];
    formatoEncabezado?: IFormato;
    formatoContenido?: IFormato;
}

export interface IContenido {
    celdas?: ICelda[];
    filas?: IFila[];
    columnas?: IColumna[];
    matrices?: IMatriz[];
}
