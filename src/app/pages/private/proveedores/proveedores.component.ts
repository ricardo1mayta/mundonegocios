import { CommonModule } from "@angular/common";
import { Component, inject, model, signal, viewChild } from "@angular/core";
import { ReactiveFormsModule, FormGroup, FormControl } from "@angular/forms";
import { MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialog } from "@angular/material/dialog";
import { DataTableComponent } from "../../../core/components/data-table/data-table.component";
import { IReporteExcel } from "../../../core/components/data-table/data-table.model";
import { DataTableModule } from "../../../core/components/data-table/data-table.module";
import { FormCrudComponent } from "../../../core/components/form-crud/form-crud.component";
import { FormFilterComponent } from "../../../core/components/form-crud/form-filter/form-filter.component";
import { FormListComponent } from "../../../core/components/form-crud/form-list/form-list.component";
import { MaterialModule } from "../../../core/modules/material/material.module";

import { ClientesService } from "../../../core/services/clientes/clientes.service";
import { CrearProveedoresComponent } from "./crear-proveedores/crear-proveedores.component";
import { ProvedoresService } from "../../../core/services/provedores/provedores.service";
import Swal from "sweetalert2";
import { RutaService } from "src/app/core/services/general/ruta.service";

@Component({
  selector: "app-proveedores",
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
  templateUrl: "./proveedores.component.html",
  styleUrl: "./proveedores.component.css",
})
export class ProveedoresComponent {
  filtros = model<any>();
  private rutaService = inject(RutaService);
  filtroForm = new FormGroup({
    buscador: new FormControl(),
    fechaDesde: new FormControl(),
    fechaHasta: new FormControl(),
  });

  urlApi = signal("");

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
    private provedoresService: ProvedoresService,
  ) {}

  ngOnInit(): void {
    this.rutaService.setPermisosRuta({
      puedeCrear: true,
      puedeExportar: false,
    });
    console.log("URL del servicio:", this.provedoresService.urlConsultarPedidos);
    this.urlApi = signal(this.provedoresService.urlConsultarPedidos);

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
  crearPedido(): void {
    const dialogRef = this.dialog.open(CrearProveedoresComponent, {
      width: "55rem", // coincide con max-w-3xl
      maxWidth: "95vw",
      data: {
        title: "Crear Cliente Api Key",
        boton: "Guardar",
      },
    });

    dialogRef.afterClosed().subscribe((resultado: unknown) => {
      if (resultado) {
        this.buscar();
      }
    });
  }

  editarPedido(provedor: any): void {
    const dialogRef = this.dialog.open(CrearProveedoresComponent, {
      width: "55rem", // coincide con max-w-3xl
      maxWidth: "95vw",
      data: {
        title: "Crear Cliente Api Key",
        boton: "Guardar",
        provedor: provedor.datos,
      },
    });

    dialogRef.afterClosed().subscribe((resultado: unknown) => {
      if (resultado) {
        this.buscar();
      }
    });
  }
  eliminarPedido(provedor: any): void {
    Swal.fire({
      html: `
       <h2 style="text-align:center">¿Estás seguro?</h2>
       <p style="text-align:center">No podrás revertir esto</p>
     `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, Eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        this.provedoresService.eliminarProvedor(provedor.datos.id).subscribe({
          next: () => {
            this.buscar();
          },
          error: (error) => {
            console.error("Error al eliminar el proveedor:", error);
          },
        });
      }
    });
  }
}
