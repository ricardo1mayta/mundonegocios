import { CommonModule, formatDate } from "@angular/common";
import { Component, computed, inject, model, OnInit, signal, viewChild } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { Router } from "@angular/router";
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, provideNativeDateAdapter } from "@angular/material/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { PrimeNgModule } from 'src/app/core/modules/primeng/primeng.module';

import { MaterialModule } from "../../../core/modules/material/material.module";
import { FormCrudComponent } from "../../../core/components/form-crud/form-crud.component";
import { FormFilterComponent } from "../../../core/components/form-crud/form-filter/form-filter.component";
import { FormListComponent } from "../../../core/components/form-crud/form-list/form-list.component";
import { DataTableModule } from "../../../core/components/data-table/data-table.module";
import { DataTableComponent } from "../../../core/components/data-table/data-table.component";
import { IReporteExcel } from "../../../core/components/data-table/data-table.model";
import { PedidosService } from "../../../core/services/pedidos/pedidos.service";
import { RutaService } from "src/app/core/services/general/ruta.service";

@Component({
  selector: "app-facturacion-listado",
  imports: [PrimeNgModule, CommonModule,
    MaterialModule,
    FormCrudComponent,
    FormFilterComponent,
    FormListComponent,
    DataTableModule,
    ReactiveFormsModule,
  ],
  templateUrl: "./facturacion-listado.component.html",
  styleUrl: "./facturacion-listado.component.css",
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: "es-PE" },
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: { dateInput: "DD/MM/YYYY" },
        display: {
          dateInput: "dd/MM/yyyy",
          monthYearLabel: "MMM yyyy",
          dateA11yLabel: "dd/MM/yyyy",
          monthYearA11yLabel: "MMMM yyyy",
        },
      },
    },
  ],
})
export class FacturacionListadoComponent implements OnInit {
  filtros = model<any>();
  filtroForm = new FormGroup({
    buscador: new FormControl(),
    fechaDesde: new FormControl(),
    fechaHasta: new FormControl(),
  });

  private router = inject(Router);
  private pedidosService = inject(PedidosService);
  private rutaService = inject(RutaService);
  private snackBar = inject(MatSnackBar);

  urlApi = signal(this.pedidosService.urlConsultarFacturacionPedidos);
  dataTable = viewChild(DataTableComponent);
  opcionesApi = signal({ campoOrdenamiento: "pedidoId", orden: 0 });

  configuracionExcel: IReporteExcel = {
    titulo: "Comprobantes FE",
    fuente: "Listado de boletas y facturas",
    columnas: [
      { titulo: "Pedido ID", fn: (f: any) => f?.pedidoId ?? "-" },
      { titulo: "Documento FE ID", fn: (f: any) => f?.documentId ?? "-" },
      { titulo: "Tipo", fn: (f: any) => f?.tipoComprobante ?? "-" },
      { titulo: "Estado SUNAT", fn: (f: any) => f?.estadoSunat ?? "-" },
      { titulo: "Serie", fn: (f: any) => f?.serie ?? "-" },
      { titulo: "Correlativo", fn: (f: any) => f?.correlativo ?? "-" },
      { titulo: "Doc Cliente", fn: (f: any) => f?.clienteDocumento ?? "-" },
      { titulo: "Cliente", fn: (f: any) => f?.clienteNombre ?? "-" },
      { titulo: "Total", fn: (f: any) => f?.totalPedido ?? "-" },
      { titulo: "Envio SUNAT", fn: (f: any) => f?.fechaEnvioSunat ?? "-" },
      { titulo: "Respuesta SUNAT", fn: (f: any) => f?.fechaRespuestaSunat ?? "-" },
      { titulo: "Codigo SUNAT", fn: (f: any) => f?.sunatResponseCode ?? "-" },
      { titulo: "Descripcion SUNAT", fn: (f: any) => f?.sunatDescription ?? "-" },
    ],
  };

  filtrosApi = computed(() => {
    const f = this.filtros();
    if (!f) return null;

    return {
      ...f,
      fechaDesde: this.formatearFecha(f.fechaDesde),
      fechaHasta: this.formatearFecha(f.fechaHasta),
    };
  });

  ngOnInit(): void {
    this.rutaService.setPermisosRuta({
      puedeCrear: false,
      puedeExportar: false,
    });

    this.filtroForm.valueChanges.pipe(debounceTime(400), distinctUntilChanged()).subscribe(() => this.aplicarFiltros());
    this.buscar();
  }

  buscar(): void {
    this.dataTable()?.recargarTabla();
  }

  aplicarFiltros(): void {
    const { buscador, fechaDesde, fechaHasta } = this.filtroForm.getRawValue();
    this.filtros.set({
      buscador: buscador?.trim() || null,
      fechaDesde: this.formatearFecha(fechaDesde),
      fechaHasta: this.formatearFecha(fechaHasta),
    });
    this.dataTable()?.recargarTabla();
  }

  irAPedidos() {
    this.router.navigate(["/admin/ventas/pedidos"]);
  }

  estadoLabel(row: any): string {
    return row?.estadoSunat ?? "-";
  }

  estadoClass(row: any): string {
    const estado = this.estadoLabel(row);
    switch (estado) {
      case "SUNAT_ACEPTADO":
        return "bg-green-100 text-green-700";
      case "SUNAT_RECHAZADO":
      case "SUNAT_ERROR":
        return "bg-red-100 text-red-700";
      case "SUNAT_EN_PROCESO":
      case "ENVIADO_A_FACTURACION":
      case "PENDIENTE_EMISION":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  }

  descargarXml(row: any): void {
    const pedidoId = Number(row?.pedidoId);
    if (!pedidoId) return;

    this.pedidosService.obtenerXmlFacturacion(pedidoId).subscribe({
      next: (blob) => this.descargarBlob(blob, `pedido-${pedidoId}.xml`),
      error: () => this.snackBar.open("No se pudo descargar el XML", "Cerrar", { duration: 3000 }),
    });
  }

  verPdf(row: any): void {
    const pedidoId = Number(row?.pedidoId);
    if (!pedidoId) return;

    this.pedidosService.obtenerPdfFacturacion(pedidoId).subscribe({
      next: (blob) => this.abrirBlob(blob),
      error: () => this.snackBar.open("No se pudo abrir el PDF", "Cerrar", { duration: 3000 }),
    });
  }

  private abrirBlob(blob: Blob): void {
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank", "noopener,noreferrer");
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  }

  private descargarBlob(blob: Blob, nombreArchivo: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = nombreArchivo;
    link.click();
    URL.revokeObjectURL(url);
  }

  private formatearFecha(valor: unknown): string | null {
    if (!valor) return null;
    if (valor instanceof Date) {
      return formatDate(valor, "yyyy-MM-dd", "en-CA");
    }
    if (typeof valor !== "string") return null;
    const texto = valor.trim();
    if (!texto) return null;
    const iso = texto.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (iso) return texto;
    const latam = texto.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (latam) {
      const [_, d, m, y] = latam;
      return `${y}-${m}-${d}`;
    }
    const fecha = new Date(texto);
    return isNaN(fecha.getTime()) ? null : formatDate(fecha, "yyyy-MM-dd", "en-CA");
  }
}
