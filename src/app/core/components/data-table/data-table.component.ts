import {
  Component,
  computed,
  contentChild,
  contentChildren,
  effect,
  inject,
  input,
  model,
  output,
  signal,
  TemplateRef,
  ViewChild,
  viewChild,
} from "@angular/core";
import { IEventoBoton, IEventoCheck, IReporteExcel, IListaPaginada, IListaPaginadaPeticion } from "./data-table.model";
import { HttpClient } from "@angular/common/http";
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule, PageEvent } from "@angular/material/paginator";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { SelectionModel } from "@angular/cdk/collections";
import { MatCheckboxChange, MatCheckboxModule } from "@angular/material/checkbox";
import { PaginatorIntl } from "./paginator-intl";
import { CommonModule, DatePipe } from "@angular/common";
import { MatMenuModule } from "@angular/material/menu";
import { RutaService } from "../../services/general/ruta.service";
import { IRespuestaApi } from "../../models/generic/general.model";
import { IColumna, IContenido } from "../../models/excel/excel.model";
import { ExcelService } from "../../services/excel/excel.service";
import { MaterialModule } from "../../modules/material/material.module";
import { ViewEncapsulation } from "@angular/core";
import { GpPaginatorComponent } from "../paginator/gp-paginator.component";
@Component({
  selector: "app-columna-tabla",
  standalone: true,
  imports: [],
  template: "",
  encapsulation: ViewEncapsulation.None,
})
export class ColumnaTablaComponent {
  titulo = input.required<string>();
  propiedad = input.required<string>();
  clase = input<string>();
  esEstado = input<boolean>(false);
  plantilla = contentChild(TemplateRef<any>);
}

@Component({
  selector: "app-accion-tabla",
  standalone: true,
  imports: [],
  template: "",
})
export class AccionTablaComponent {
  private readonly rutaService = inject(RutaService);
  codigo = input<string>();
  etiqueta = input.required<string>();
  icono = input.required<string>();
  mostrarCuando = input<(row: any) => boolean>();
  accion = output<IEventoBoton>();
  tienePermiso = computed(() => this.rutaService.obtenerPermisoBoton(this.codigo() || this.etiqueta()));
}

@Component({
  selector: "app-data-table",
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatCheckboxModule,
    GpPaginatorComponent,
  ],
  providers: [
    {
      provide: MatPaginatorIntl,
      useClass: PaginatorIntl,
    },
    DatePipe,
  ],
  templateUrl: "./data-table.component.html",
  styleUrl: "./data-table.component.scss",
})
export class DataTableComponent {
  columnas = contentChildren(ColumnaTablaComponent);
  botones = contentChildren(AccionTablaComponent);
  tituloColumnas = computed(() => this.columnas().map((column) => column.titulo()));
  columnasAMostrar = computed(() => {
    const titulos = this.columnas().map((columna) => columna.propiedad());
    if (this.mostrarColumnaSeleccion()) {
      titulos.unshift("seleccion");
    }
    if (this.botones().length > 0) {
      titulos.push("acciones");
    }
    return titulos;
  });

  pageIndex = signal(0);
  pageSize = signal(10);

  /*cambioPagina(e: { pageIndex: number; pageSize: number }) {
    this.pageIndex.set(e.pageIndex);
    this.pageSize.set(e.pageSize);
    // aquí tu lógica: pedir data al backend, etc.
  }*/

  mostrarMensajeTablaVacia = signal<boolean>(true);
  mensajeTablaVacia = input<string>("No se hallaron coincidencias para tu búsqueda, intenta cambiar tu búsqueda");
  paginable = input<boolean>(true);
  tamanioPagina = model<number>(5);
  paginaActual = signal<number>(0);
  totalRegistros = signal<number>(0);
  urlApi = input<string>("");
  metodoApi = input<"get" | "post">("post");
  urlExcel = input<string>("");
  metodoExcel = input<"get" | "post" | "">("");
  parametrosApi = input<any>({});
  datos = model<any[]>([]);
  origenDatos = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  height = input<string>("auto");
  ngHeight = computed(() => {
    if (this.paginable() || this.height() === "auto" || !this.height()) {
      return {};
    }
    return { maxHeight: this.height(), height: this.height() };
  });

  mostrarColumnaSeleccion = input<boolean>(false);
  seleccion = new SelectionModel<any>(true, []);
  checkCabeceraSeleccionada = signal<boolean>(false);
  checkCabeceraIndeterminado = signal<boolean>(false);
  datosIniciales: any[] = [];
  cambioSeleccionados = output<IEventoCheck>();
  aplicarPermisos = input<boolean>(false);

  constructor(
    private httpClient: HttpClient,
    private datePipe: DatePipe,
  ) {
    effect(
      () => {
        this.origenDatos.data = this.datos();
        this.mostrarMensajeTablaVacia.set(!this.datos()?.length);
        this.actualizarEstadoCheckCabecera();
      },
      { allowSignalWrites: true },
    );

    effect(() => {
      if (this.urlApi() && this.parametrosApi()) {
        this.recargarTabla(0);
      }
    });

    effect(() => {
      this.origenDatos.paginator = this.paginator;
    });
  }
  /* ngAfterViewInit() {
    this.origenDatos.paginator = this.paginator;
  }*/
  recargarTabla(indice?: number) {
    if (!this.urlApi()) {
      // Evita requests a "/" cuando no hay endpoint configurado
      return;
    }
    const pageIndex0 = indice ?? this.paginaActual(); // 0-based (UI)
    const pageBackend = pageIndex0; // 0-based (API)

    const parametros = {
      datos: this.parametrosApi(),
      pagina: pageBackend,
      tamanio: this.tamanioPagina(),
    };

    this.obtenerDatos<any>(this.metodoApi(), this.urlApi(), parametros).subscribe((resp) => {
      const data = resp?.data ?? resp;
      const lista =
        data?.lista ??
        data?.content ??
        data?.items ??
        (Array.isArray(data) ? data : null) ??
        (Array.isArray(resp) ? resp : []) ??
        [];

      // backend devuelve 0-based
      const backendPage = Number(data?.paginaActual ?? data?.page ?? pageBackend);
      this.paginaActual.set(Math.max(0, backendPage));

      this.origenDatos = new MatTableDataSource<any>(lista);
      this.totalRegistros.set(Number(data?.totalRegistros ?? data?.total ?? data?.totalElements ?? lista.length ?? 0));
      this.mostrarMensajeTablaVacia.set(!lista.length);
    });
  }

  obtenerDatos<T>(metodoApi: string, urlApi: string, parametros: any) {
    if (metodoApi === "get") {
      const queryString = Object.keys(parametros)
        .map((key) => `${key}=${parametros[key]}`)
        .join("&");
      urlApi += urlApi.indexOf("?") >= 0 ? "&" : "?";
      return this.httpClient.get<T>(urlApi + queryString);
    }
    return this.httpClient.post<T>(urlApi, parametros);
  }
  exportarXLS(nombreArchivo: string, configuracion?: IReporteExcel) {
    if (!this.urlExcel()) {
      console.error("No se ha definido la url para exportar a excel");
      return;
    }

    const fechaHora = new Date().toISOString().replace(/:/g, "-");
    const filename = nombreArchivo + "_" + fechaHora;

    const parametros: IListaPaginadaPeticion<any> = {
      datos: this.parametrosApi(),
      pagina: 0,
      tamanio: this.tamanioPagina(),
    };

    this.obtenerDatos<IRespuestaApi<any>>(
      this.metodoExcel() || this.metodoApi(),
      this.urlExcel(),
      this.parametrosApi(),
    ).subscribe((respuesta) => {
      const datos = respuesta!.data || [];
      const datosExcel = this.crearContenidoReporte(datos, configuracion);
      ExcelService.exportar(filename, datosExcel);
    });
  }
  crearContenidoReporte(datos: any[], cfg?: IReporteExcel): IContenido {
    const contenidoExcel: IContenido = {
      celdas: [
        {
          ubicacion: "A1",
          contenido: cfg?.titulo ?? "",
          formato: {
            negrita: true,
            tamanioLetra: 14,
          },
        },
        { ubicacion: "A2", contenido: "Fuente:" },
        { ubicacion: "B2", contenido: cfg?.fuente ?? "" },
        { ubicacion: "A3", contenido: "Fecha y Hora:" },
        {
          ubicacion: "B3",
          contenido: this.datePipe.transform(new Date(), "dd/MM/yyyy HH:mm"),
        },
      ],
      filas: [
        {
          indiceFila: 4,
          columnaInicial: 0,
          contenido: cfg && cfg.columnas ? cfg.columnas.map((columna) => columna.titulo) : [],
          formato: {
            color: "ffffff",
            fondo: "000080",
            negrita: true,
            estiloBorde: "thin",
            alineacionHorizontal: "center",
          },
        },
      ],
      columnas: [],
    };

    if (!contenidoExcel.columnas) {
      contenidoExcel.columnas = [];
    }
    if (cfg && cfg.columnas) {
      for (let i = 0; i < cfg.columnas.length; i++) {
        const col: IColumna = {
          indiceColumna: i,
          filaInicial: 5,
          contenido: [],
          ancho: cfg.columnas[i].ancho,
          formato: cfg.columnas[i].formato,
        };

        if (cfg.columnas[i].propiedad) {
          if (cfg.columnas[i].esFecha) {
            const propiedad = cfg.columnas[i].propiedad;
            col.contenido = propiedad
              ? datos.map((dato) =>
                  dato[propiedad] ? this.datePipe.transform(dato[propiedad], "dd/MM/yyyy HH:mm") : "",
                )
              : [];
          } else {
            const propiedad = cfg.columnas[i].propiedad;
            col.contenido = propiedad ? datos.map((dato) => (dato[propiedad] ? dato[propiedad] : "")) : [];
          }
        } else if (cfg.columnas[i].fn) {
          col.contenido = datos.map((dato) => cfg.columnas[i].fn!(dato));
        }

        contenidoExcel.columnas.push(col);
      }
    }
    return contenidoExcel;
  }
  cambioPagina(e: PageEvent) {
    const indexActual = this.paginaActual();
    const sizeActual = this.tamanioPagina();

    if (e.pageIndex !== indexActual || e.pageSize !== sizeActual) {
      this.paginaActual.set(e.pageIndex);
      this.tamanioPagina.set(e.pageSize);
      this.recargarTabla(e.pageIndex);
    }
  }

  /** Métodos para los checks de selección */
  cambioCheckCabecera(evento: MatCheckboxChange) {
    this.checkCabeceraIndeterminado.set(false);
    this.checkCabeceraSeleccionada.set(evento.checked);

    if (!evento.checked) {
      this.seleccion.clear();
    } else {
      this.seleccion.select(...this.datosIniciales);
    }

    this.cambioSeleccionados.emit({
      fila: null,
      seleccionado: evento.checked,
      filasSeleccionadas: this.seleccion.selected,
    });
  }

  cambioCheck(fila: any, evento: MatCheckboxChange) {
    this.seleccion.toggle(fila);

    if (evento.checked) {
      const todosChecksSeleccionados = this.todosChecksSeleccionados();
      this.checkCabeceraIndeterminado.set(!todosChecksSeleccionados);
      this.checkCabeceraSeleccionada.set(todosChecksSeleccionados);
    } else {
      this.checkCabeceraSeleccionada.set(false);
      this.checkCabeceraIndeterminado.set(!this.seleccion.isEmpty());
    }

    this.cambioSeleccionados.emit({
      fila: fila,
      seleccionado: evento.checked,
      filasSeleccionadas: this.seleccion.selected,
    });
  }

  todosChecksSeleccionados() {
    return this.seleccion.selected.length === this.datosIniciales.length;
  }

  resetearSeleccion() {
    this.seleccion.clear();
    this.checkCabeceraSeleccionada.set(false);
    this.checkCabeceraIndeterminado.set(false);
  }

  actualizarEstadoCheckCabecera() {
    if (this.checkCabeceraSeleccionada()) {
      this.seleccion.select(...this.origenDatos.data);
    } else if (this.mostrarColumnaSeleccion()) {
      if (this.datosIniciales.length == 0) {
        this.datosIniciales = this.origenDatos.data;
      }
      const cantidadSeleccionados = this.seleccion.selected.length;
      const totalFilas = this.datosIniciales.length;
      this.checkCabeceraIndeterminado.set(cantidadSeleccionados > 0 && cantidadSeleccionados < totalFilas);
      this.checkCabeceraSeleccionada.set(totalFilas > 0 && cantidadSeleccionados === totalFilas);
    }
  }

  obtenerFilasCheckeadas() {
    return this.seleccion.selected;
  }

  limpiar() {
    this.origenDatos = new MatTableDataSource<any>([]);
    this.totalRegistros.set(0);
    this.mostrarMensajeTablaVacia.set(true);
    this.actualizarEstadoCheckCabecera();
  }
}
