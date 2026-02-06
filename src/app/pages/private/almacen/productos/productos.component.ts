import { CommonModule } from "@angular/common";
import { Component, model, signal, ViewChild, viewChild } from "@angular/core";
import { ReactiveFormsModule, FormGroup, FormControl, FormsModule } from "@angular/forms";
import { MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialog } from "@angular/material/dialog";
import { DataTableComponent } from "../../../../core/components/data-table/data-table.component";
import { IReporteExcel } from "../../../../core/components/data-table/data-table.model";
import { DataTableModule } from "../../../../core/components/data-table/data-table.module";
import { FormCrudComponent } from "../../../../core/components/form-crud/form-crud.component";
import { FormFilterComponent } from "../../../../core/components/form-crud/form-filter/form-filter.component";
import { FormListComponent } from "../../../../core/components/form-crud/form-list/form-list.component";
import { MaterialModule } from "../../../../core/modules/material/material.module";

import { MatSlideToggleModule } from "@angular/material/slide-toggle";

import { CrearProductosComponent } from "./crear-productos/crear-productos.component";
import { ProductosService } from "../../../../core/services/productos/productos.service";
import { Producto } from "../../../../core/models/almacen/producto";
import { ImagePreviewDialogComponent } from "../../../../shared/components/image-preview-dialog/image-preview-dialog.component";
import { SwitchComponent } from "src/app/shared/components/form/input/switch.component";
import { BadgeComponent } from "src/app/shared/components/ui/badge/badge.component";

@Component({
  selector: "app-productos",
  imports: [
    CommonModule,
    MatSlideToggleModule,
    MaterialModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormCrudComponent,
    FormFilterComponent,
    FormListComponent,
    DataTableModule,
    ReactiveFormsModule,
    FormsModule,
    BadgeComponent,
  ],
  templateUrl: "./productos.component.html",
  styleUrl: "./productos.component.css",
})
export class ProductosComponent {
  filtros = model<any>();

  filtroForm = new FormGroup({
    buscador: new FormControl(),
    fechaDesde: new FormControl(),
    fechaHasta: new FormControl(),
  });

  urlApi = signal("");
  getBadgeColor(status: string): "success" | "warning" | "error" {
    if (status) return "success";
    if (!status) return "warning";
    return "error";
  }
  @ViewChild(DataTableComponent)
  dataTable!: DataTableComponent;

  configuracionExcel: IReporteExcel = {
    titulo: "Lista de pedidos",
    fuente: "Order de pedidos",

    columnas: [{ titulo: "Codigo", propiedad: "codigo" }],
  };

  constructor(
    private dialog: MatDialog,
    private productosService: ProductosService,
  ) {}

  ngOnInit(): void {
    this.urlApi = signal(this.productosService.urlListaProductos);
    this.buscar();
  }

  buscar(): void {
    console.log("buscar");
    this.dataTable?.recargarTabla();
  }
  aplicarFiltros(): void {
    const { buscador, fechaDesde, fechaHasta } = this.filtroForm.getRawValue();
    this.filtros.set({
      buscador: buscador?.trim() || null,
    });
    this.dataTable?.recargarTabla(); // dispara la petición al backend
  }
  crearMarca(): void {
    const dialogRef = this.dialog.open(CrearProductosComponent, {
      width: "80rem", // coincide con max-w-3xl
      maxWidth: "90rem",
      data: {
        title: "Crear Cliente Api Key",
        boton: "Guardar",
      },
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        this.buscar();
      }
    });
  }
  // eliminarMarca
  eliminarMarca(producto: Producto): void {
    this.productosService.eliminarProducto(producto.id).subscribe({
      next: () => {
        this.buscar();
      },
      error: (error) => {
        console.error("Error al eliminar la marca:", error);
      },
    });
  }
  // editar
  editarMarca(producto: Producto): void {
    const dialogRef = this.dialog.open(CrearProductosComponent, {
      width: "80rem", // coincide con max-w-3xl
      maxWidth: "90rem",
      data: { ...producto, categoria: producto.categoria?.id, marca: producto.marca?.id },
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        this.buscar();
      }
    });
  }

  verImagen(url: string | null): void {
    console.log("Ver imagen:", url);
    if (!url) {
      return;
    }
    this.dialog.open(ImagePreviewDialogComponent, {
      data: { imgUrl: url },
      maxWidth: "95vw",
      panelClass: "p-0", // sin padding del contenedor
    });
  }
}
