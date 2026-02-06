import { CommonModule } from "@angular/common";
import { Component, model, signal, ViewChild, viewChild } from "@angular/core";
import { ReactiveFormsModule, FormGroup, FormControl, FormsModule } from "@angular/forms";
import { MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialog } from "@angular/material/dialog";

import { MatSlideToggleChange } from "@angular/material/slide-toggle";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { DataTableComponent } from "../../../core/components/data-table/data-table.component";
import { IReporteExcel } from "../../../core/components/data-table/data-table.model";
import { DataTableModule } from "../../../core/components/data-table/data-table.module";
import { FormCrudComponent } from "../../../core/components/form-crud/form-crud.component";
import { FormFilterComponent } from "../../../core/components/form-crud/form-filter/form-filter.component";
import { FormListComponent } from "../../../core/components/form-crud/form-list/form-list.component";
import { MaterialModule } from "../../../core/modules/material/material.module";
import { InventarioService } from "../../../core/services/inventario/inventario.service";
import { EditarStockModalComponent } from "./invertario/editar-stock-modal/editar-stock-modal.component";
import { ImagePreviewDialogComponent } from "../../../shared/components/image-preview-dialog/image-preview-dialog.component";
import { SwitchComponent } from "src/app/shared/components/form/input/switch.component";

@Component({
  selector: "app-almacen",
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
    SwitchComponent,
  ],
  templateUrl: "./almacen.component.html",
  styleUrl: "./almacen.component.css",
})
export class AlmacenComponent {
  filtros = model<any>();

  filtroForm = new FormGroup({
    buscador: new FormControl(),
    fechaDesde: new FormControl(),
    fechaHasta: new FormControl(),
  });

  urlApi = signal("");

  @ViewChild(DataTableComponent)
  dataTable!: DataTableComponent;

  configuracionExcel: IReporteExcel = {
    titulo: "Lista de pedidos",
    fuente: "Order de pedidos",

    columnas: [{ titulo: "Codigo", propiedad: "codigo" }],
  };

  constructor(
    private dialog: MatDialog,
    private inventarioService: InventarioService,
  ) {}

  ngOnInit(): void {
    this.urlApi = signal(this.inventarioService.urlListaProductosDisponibles);
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
  editar(idDetalle: number, campo: string, valor: any): void {
    const valorActualizado = valor.target.value;
    const data = {
      campo: campo,
      valor: valorActualizado,
    };
    console.log("Editar campo:", campo, "con valor:", valorActualizado);

    if (campo != "" && valorActualizado > 0) {
      this.inventarioService.actualizarInventario(idDetalle, data).subscribe({
        next: () => {
          //this.dataTable?.recargarTabla();
        },
        error: (error) => {
          console.error("Error al actualizar el inventario:", error);
          alert("Error al actualizar el inventario. Por favor, inténtelo de nuevo.");
        },
      });
    }
  }
  editarEstado(idDetalle: number, campo: string, checked: boolean): void {
    // Convierte el boolean a 1/0
    const valorActualizado = checked ? 1 : 0;

    const data = {
      campo,
      valor: valorActualizado, // ahora es 1 ó 0
    };

    console.log("Editar campo:", campo, "con valor:", valorActualizado);

    if (campo) {
      this.inventarioService.actualizarInventario(idDetalle, data).subscribe({
        next: () => {
          // this.dataTable?.recargarTabla(); // si necesitas refrescar
        },
        error: (err) => {
          console.error("Error al actualizar el inventario:", err);
          alert("Error al actualizar el inventario. Por favor, inténtelo de nuevo.");
        },
      });
    }
  }

  abrirModalStock(elemento: any): void {
    const ref = this.dialog.open(EditarStockModalComponent, {
      data: { id: elemento.id, nombreProducto: elemento.nombreProducto },
      hasBackdrop: true, // muestra backdrop
      disableClose: true, // permite cerrar con clic fuera o con ESC
    });

    ref.afterClosed().subscribe((nuevoStock) => {
      //cargar la lista
      this.buscar();
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
