import { Component, computed, contentChild, inject, input, output } from "@angular/core";
import { CommonModule, NgClass } from "@angular/common";
import { DataTableComponent } from "../../data-table/data-table.component";
import { IReporteExcel } from "../../data-table/data-table.model";
import { RutaService } from "../../../services/general/ruta.service";
import { PrimeNgModule } from "../../../modules/primeng/primeng.module";

@Component({
  selector: "app-form-list",
  standalone: true,
  imports: [CommonModule, NgClass, PrimeNgModule],
  templateUrl: "./form-list.component.html",
  styleUrl: "./form-list.component.scss",
})
export class FormListComponent {
  private readonly rutaService = inject(RutaService);
  class = input<string>();
  etiquetaAgregar = input<string>("Agregar");
  agregarClick = output();
  tabla = contentChild(DataTableComponent);
  nombreExcel = input<string>("Exportado");
  configuracionExcel = input<IReporteExcel>();
  permisoBotonAgregar = computed(() => this.rutaService.permisos().puedeCrear);
  permisoBotonExportar = computed(() => this.rutaService.permisos().puedeExportar);

  exportarExcel(): void {
    const tabla = this.tabla();
    if (tabla) {
      tabla.exportarXLS(this.nombreExcel(), this.configuracionExcel());
    }
  }
}