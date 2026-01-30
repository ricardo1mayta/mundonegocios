import XLSX from 'xlsx-js-style';
import saveAs from 'file-saver';
import { IContenido, IFormato } from '../../models/excel/excel.model';

export class ExcelService {
  private static crearEstilo(formato?: IFormato): XLSX.CellStyle {
    if (!formato) return {};
    return {
      font: {
        bold: formato.negrita,
        name: formato.fuente,
        sz: formato.tamanioLetra,
        color: formato.color
          ? { rgb: formato.color.replace('#', '') }
          : undefined,
      },
      fill: formato.fondo
        ? {
            patternType: 'solid',
            fgColor: { rgb: formato.fondo.replace('#', '') },
          }
        : undefined,
      border:
        formato.colorBorde || formato.estiloBorde
          ? {
              top: {
                color: { rgb: formato.colorBorde },
                style: formato.estiloBorde,
              },
              bottom: {
                color: { rgb: formato.colorBorde },
                style: formato.estiloBorde,
              },
              left: {
                color: { rgb: formato.colorBorde },
                style: formato.estiloBorde,
              },
              right: {
                color: { rgb: formato.colorBorde },
                style: formato.estiloBorde,
              },
            }
          : undefined,
      alignment: {
        horizontal: formato.alineacionHorizontal,
        vertical: formato.alineacionVertical,
      },
    };
  }

  static exportar(nombreArchivo: string, contenido: IContenido) {
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([]);

    // Agregar celdas individuales
    contenido.celdas?.forEach((celda) => {
      XLSX.utils.sheet_add_aoa(worksheet, [[celda.contenido]], {
        origin: celda.ubicacion,
      });
      worksheet[celda.ubicacion].s = this.crearEstilo(celda.formato);
    });

    // Agregar filas
    contenido.filas?.forEach((fila) => {
      XLSX.utils.sheet_add_aoa(worksheet, [fila.contenido], {
        origin: {
          r: fila.indiceFila,
          c: fila.columnaInicial,
        },
      });

      for (let i = 0; i < fila.contenido.length; i++) {
        const ubicacion = XLSX.utils.encode_cell({
          r: fila.indiceFila,
          c: fila.columnaInicial + i,
        });
        worksheet[ubicacion].s = this.crearEstilo(fila.formato);
      }

      if (fila.altura) {
        if (!worksheet['!rows']) worksheet['!rows'] = [];
        worksheet['!rows'][fila.indiceFila] = { hpx: fila.altura };
      }
    });

    // Agregar columnas
    contenido.columnas?.forEach((columna) => {
      const contenido = columna.contenido.map((v) => [v]);
      XLSX.utils.sheet_add_aoa(worksheet, [...contenido], {
        origin: {
          r: columna.filaInicial,
          c: columna.indiceColumna,
        },
      });

      for (let i = 0; i < columna.contenido.length; i++) {
        const ubicacion = XLSX.utils.encode_cell({
          r: columna.filaInicial + i,
          c: columna.indiceColumna,
        });
        worksheet[ubicacion].s = this.crearEstilo(columna.formato);
      }

      if (columna.ancho) {
        if (!worksheet['!cols']) worksheet['!cols'] = [];
        worksheet['!cols'][columna.indiceColumna] = {
          wpx: columna.ancho,
        };
      }
    });

    // Agregar matrices
    // contenido.matrices?.forEach((matriz) => {
    //     matriz.encabezados.forEach((valor, index) => {
    //         const colLetra = XLSX.utils.encode_col(matriz.columnaInicial + index);
    //         const celdaDireccion = `${colLetra}${matriz.filaInicial + 1}`;
    //         worksheet[celdaDireccion] = {
    //             v: valor,
    //             s: this.crearEstilo(matriz.formatoEncabezado),
    //         };
    //     });

    //     matriz.contenido.forEach((fila, filaIndex) => {
    //         fila.forEach((valor, colIndex) => {
    //             const colLetra = XLSX.utils.encode_col(matriz.columnaInicial + colIndex);
    //             const celdaDireccion = `${colLetra}${matriz.filaInicial + filaIndex + 2}`;
    //             worksheet[celdaDireccion] = {
    //                 v: valor,
    //                 s: this.crearEstilo(matriz.formatoContenido),
    //             };
    //         });
    //     });
    // });

    // Agregar la hoja al libro
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Hoja1');

    // Convertir a buffer
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    // Guardar archivo
    this.saveAsExcelFile(excelBuffer, nombreArchivo);
  }

  private static saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(data, `${fileName}.xlsx`);
  }
}
