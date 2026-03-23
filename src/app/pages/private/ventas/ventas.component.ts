import { CommonModule, formatDate } from "@angular/common";
import { Component, computed, inject, model, OnInit, signal, viewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, provideNativeDateAdapter } from "@angular/material/core";
import { MaterialModule } from "../../../core/modules/material/material.module";
import { FormCrudComponent } from "../../../core/components/form-crud/form-crud.component";
import { FormFilterComponent } from "../../../core/components/form-crud/form-filter/form-filter.component";
import { FormListComponent } from "../../../core/components/form-crud/form-list/form-list.component";
import { DataTableModule } from "../../../core/components/data-table/data-table.module";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";

import { DataTableComponent } from "../../../core/components/data-table/data-table.component";
import { IReporteExcel } from "../../../core/components/data-table/data-table.model";
import { PedidosService } from "../../../core/services/pedidos/pedidos.service";

import { Router } from "@angular/router";
import { Pedido } from "../../../core/models/ventas/pedidos";
import Swal from "sweetalert2";
import { VisualizarVentaComponent } from "./visualizar-venta/visualizar-venta.component";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { RutaService } from "src/app/core/services/general/ruta.service";

@Component({
  selector: "app-ventas",
  imports: [
    CommonModule,
    MaterialModule,
    FormCrudComponent,
    FormFilterComponent,
    FormListComponent,
    DataTableModule,
    ReactiveFormsModule,
  ],
  templateUrl: "./ventas.component.html",
  styleUrl: "./ventas.component.css",
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
export class VentasComponent implements OnInit {
  filtros = model<any>();

  filtroForm = new FormGroup({
    buscador: new FormControl(),
    fechaDesde: new FormControl(),
    fechaHasta: new FormControl(),
  });

  urlApi = signal("");
  urlApiReporte = signal("");
  private router = inject(Router);
  dataTable = viewChild(DataTableComponent);

  configuracionExcel: IReporteExcel = {
    titulo: "Lista de pedidos",
    fuente: "Order de pedidos",
    columnas: [
      { titulo: "Codigo", propiedad: "codigo" },
      { titulo: "Origen", propiedad: "origen" },
      { titulo: "fechaCrea", propiedad: "fechaCrea" },
      { titulo: "fechaCrea", propiedad: "fechaEntrega" },
      { titulo: "nombreCliente", propiedad: "nombreCliente" },
      { titulo: "Doc_Cliente", propiedad: "docCliente" },
      { titulo: "Direccion", propiedad: "direccion" },
      { titulo: "Total", propiedad: "total" },
      { titulo: "observacion", propiedad: "observacion" },
      { titulo: "tipoPago", propiedad: "tipoPago" },
      { titulo: "usuarioCrea", propiedad: "usuarioCrea" },
      { titulo: "estadoPedido", propiedad: "estadoPedido" },
      { titulo: "estadoPago", propiedad: "estadoPago" },
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

  private rutaService = inject(RutaService);

  constructor(
    private dialog: MatDialog,
    private pedidosService: PedidosService,
  ) {
    this.urlApi = signal(this.pedidosService.urlConsultarPedidos);
    this.urlApiReporte.set(this.pedidosService.urlExportarPedidos);
  }

  ngOnInit(): void {
    this.rutaService.setPermisosRuta({
      puedeCrear: true,
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

  crearPedido() {
    this.router.navigate(["/admin/ventas/newpedidos"]);
  }

  editarPedido(pedido: Pedido) {
    if (pedido.estadoPedido === "ANULADO") {
      Swal.fire({
        html: `<h2 style="text-align:center">Pedido Anulado</h2>
        <p style="text-align:center">No se puede editar un pedido anulado</p>`,
        icon: "warning",
        confirmButtonText: "Aceptar",
      });
      return;
    }

    this.router.navigate(["/admin/ventas/newpedidos"], {
      state: { compraId: pedido.id },
    });
  }

  emitirFacturacion(pedido: Pedido) {
    Swal.fire({
      title: "Emitir comprobante",
      text: "Se emitira boleta o factura segun el documento del cliente.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Emitir",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (!result.isConfirmed) return;

      this.pedidosService.emitirComprobante(pedido.id).subscribe({
        next: () => {
          Swal.fire({
            icon: "success",
            title: "Enviado",
            text: "La emision del comprobante fue iniciada.",
            timer: 1800,
            showConfirmButton: false,
          });
          this.buscar();
        },
        error: (err) => {
          Swal.fire({
            icon: "error",
            title: "Error al emitir",
            text: err?.error?.message || "No se pudo emitir el comprobante.",
          });
        },
      });
    });
  }

  viewPdf(id: number) {
    this.pedidosService.obtenerTiketPorId(id).subscribe((pdfData: Blob) => {
      const pdfUrl = URL.createObjectURL(pdfData);
      window.open(pdfUrl, "_blank");
    });
  }

  downloadPdf(id: number) {
    this.pedidosService.obtenerTiketPorId(id).subscribe((blob: Blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ticket-${id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  anularPedido(pedido: Pedido) {
    Swal.fire({
      html: `
    <h2 style="text-align:center">¿Estas seguro?</h2>
    <p style="text-align:center">No podras revertir esto</p>
  `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Si, anular",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        this.pedidosService.anularPedido(pedido.id).subscribe(() => {
          this.buscar();
        });
      }
    });
  }

  verPedido(pedido: Pedido) {
    this.dialog.open(VisualizarVentaComponent, {
      width: "70rem",
      maxWidth: "95vw",
      data: {
        title: "Detalle Pedido",
        boton: "Guardar",
        pedido: pedido,
      },
    });
  }

  registrarImeis(pedido: Pedido) {
    this.router.navigate([`/admin/ventas/registro-imeis/${pedido.id}`]);
  }

  generarGuia(pedido: Pedido) {
    this.router.navigate(["/admin/guia/nueva-guia"], {
      state: { pedidoId: pedido.id },
    });
  }
}
