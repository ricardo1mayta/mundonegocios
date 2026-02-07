import { CommonModule } from "@angular/common";
import { Component, inject, model, OnInit, signal, viewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
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
  providers: [],
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

  constructor(
    private dialog: MatDialog,
    private pedidosService: PedidosService,
  ) {
    this.urlApi = signal(this.pedidosService.urlConsultarPedidos);
    this.urlApiReporte.set(this.pedidosService.urlExportarPedidos);
  }

  ngOnInit(): void {
    console.log("URL del servicio:", this.pedidosService.urlConsultarPedidos);

    console.log("URL asignada:", this.urlApi());
    this.buscar();
  }

  buscar(): void {
    console.log("buscar");
    this.dataTable()?.recargarTabla();
  }
  aplicarFiltros(): void {
    const { buscador, fechaDesde, fechaHasta } = this.filtroForm.getRawValue();
    this.filtros.set({
      buscador: buscador?.trim() || null,
      fechaDesde: fechaDesde ? new Date(fechaDesde) : null,
      fechaHasta: fechaHasta ? new Date(fechaHasta) : null,
    });
    this.dataTable()?.recargarTabla(); // dispara la petición al backend
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
    {
      this.router.navigate(["/admin/ventas/newpedidos"], {
        state: { compraId: pedido.id },
      });
    }
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
      a.download = `ticket-${id}.pdf`; // ← nombre que recibirá el archivo
      a.click();
      URL.revokeObjectURL(url); // libera memoria
    });
  }
  anularPedido(pedido: Pedido) {
    Swal.fire({
      html: `
    <h2 style="text-align:center">¿Estás seguro?</h2>
    <p style="text-align:center">No podrás revertir esto</p>
  `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, anular",
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
    // abrir modal
    const dialogRef = this.dialog.open(VisualizarVentaComponent, {
      width: "70rem", // coincide con max-w-3xl
      maxWidth: "95vw",
      data: {
        title: "Crear Cliente ",
        boton: "Guardar",
        pedido: pedido,
      },
    });

    dialogRef.afterClosed().subscribe((resultado: unknown) => {
      if (resultado) {
      }
    });
  }
}
