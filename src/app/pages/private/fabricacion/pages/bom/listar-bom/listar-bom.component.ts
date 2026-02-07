import { CommonModule } from "@angular/common";
import { Component, inject, model, OnInit, signal, viewChild } from "@angular/core";

import { MatDatepickerModule } from "@angular/material/datepicker";

import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatNativeDateModule } from "@angular/material/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { DataTableComponent } from "../../../../../../core/components/data-table/data-table.component";
import { IReporteExcel } from "../../../../../../core/components/data-table/data-table.model";
import { DataTableModule } from "../../../../../../core/components/data-table/data-table.module";
import { FormCrudComponent } from "../../../../../../core/components/form-crud/form-crud.component";
import { FormFilterComponent } from "../../../../../../core/components/form-crud/form-filter/form-filter.component";
import { FormListComponent } from "../../../../../../core/components/form-crud/form-list/form-list.component";
import { Compra } from "../../../../../../core/models/compras/compra";
import { MaterialModule } from "../../../../../../core/modules/material/material.module";
import { FichaService } from "../../../../../../core/services/ficha/ficha.service";

import { BomService } from "../../../../../../core/services/bom/bom.service";
import { VisualizarCompraComponent } from "src/app/pages/private/compras/visualizar-compra/visualizar-compra.component";

@Component({
  selector: "app-listar-bom",
  imports: [
    CommonModule,
    MaterialModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormCrudComponent,
    FormFilterComponent,
    FormListComponent,
    DataTableModule,
    ReactiveFormsModule,
  ],
  templateUrl: "./listar-bom.component.html",
  styleUrl: "./listar-bom.component.css",
})
export class ListarBomComponent implements OnInit {
  filtros = model<any>();

  filtroForm = new FormGroup({
    buscador: new FormControl(),
    fechaDesde: new FormControl(),
    fechaHasta: new FormControl(),
  });

  urlApi = signal("");
  private router = inject(Router);
  dataTable = viewChild(DataTableComponent);
  private snack = inject(MatSnackBar);
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
      { titulo: "status", propiedad: "status" },
      { titulo: "tipoPago", propiedad: "tipoPago" },
      { titulo: "pagoEfectivo", propiedad: "pagoEfectivo" },
      { titulo: "otroModoPago", propiedad: "otroModoPago" },
      { titulo: "usuarioCrea", propiedad: "usuarioCrea" },
      { titulo: "Actions", propiedad: "actions" },
    ],
  };

  constructor(
    private dialog: MatDialog,
    private comprasService: BomService,
  ) {}

  ngOnInit(): void {
    console.log("URL del servicio:", this.comprasService.urlBomervice);
    this.urlApi = signal(this.comprasService.urlBomervice);

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
    });
    this.dataTable()?.recargarTabla(); // dispara la petición al backend
  }

  crearPedido() {
    this.router.navigate(["/admin/fabricacion/mf/bom"]);
  }

  editarCompra(compra: Compra) {
    this.router.navigate(["/admin/fabricacion/mf/bom"], {
      state: { bomId: compra.id },
    });
  }
  cotizarProducto(compra: Compra) {
    this.router.navigate(["/admin/fabricacion/mf/cotizacion"], {
      state: { bomId: compra.id },
    });
  }
  registrarProducto(compra: Compra) {
    this.comprasService.repgistarProducto(compra.id).subscribe({
      next: () => {
        this.snack.open("Producto registrado ✅", "Cerrar", { duration: 2500 });
      },
      error: (e) => {
        const msg = e?.error?.message ?? "No se pudo registrar el producto ❌";
        this.snack.open(msg, "Cerrar", { duration: 3500 });
      },
    });
  }
  verCompra(pedido: Compra) {
    // abrir modal
    const dialogRef = this.dialog.open(VisualizarCompraComponent, {
      width: "70rem", // coincide con max-w-3xl
      maxWidth: "95vw",
      data: {
        title: "Crear Cliente ",
        boton: "Guardar",
        pedido: pedido,
      },
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
      }
    });
  }
  anularCompra(compra: Compra) {
    /* this.comprasService.anularCompra(compra.id).subscribe({
      next: () => {
        this.dataTable()?.recargarTabla();
      },
      error: error => {
        console.error('Error al anular la compra:', error);
      },
    });*/
  }
}
