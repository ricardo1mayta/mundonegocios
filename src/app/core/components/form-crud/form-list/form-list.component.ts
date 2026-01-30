import { Component, computed, contentChild, inject, input, output } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DataTableComponent } from '../../data-table/data-table.component';
import { IReporteExcel } from '../../data-table/data-table.model';
import { RutaService } from '../../../services/general/ruta.service';

@Component({
  selector: 'app-form-list',
  standalone: true,
  imports: [CommonModule, NgClass, MatButtonModule, MatIconModule],
  templateUrl: './form-list.component.html',
  styleUrl: './form-list.component.scss',
})
export class FormListComponent {
  private readonly rutaService = inject(RutaService);
  class = input<string>();
  etiquetaAgregar = input<string>('Agregar');
  agregarClick = output();
  tabla = contentChild(DataTableComponent);
  nombreExcel = input<string>('Exportado');
  configuracionExcel = input<IReporteExcel>();
  mostrarBotonAgregar = input(true);
  permisoBotonAgregar = computed(() => this.rutaService.permisos().puedeCrear);
  mostrarBotonExportar = input(true);
  permisoBotonExportar = computed(() => this.rutaService.permisos().puedeExportar);

  exportarExcel(): void {
    const tabla = this.tabla();
    if (tabla) {
      tabla.exportarXLS(this.nombreExcel(), this.configuracionExcel());
    }
  }
}
