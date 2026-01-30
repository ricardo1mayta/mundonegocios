import { CommonModule } from '@angular/common';
import { Component, inject, model, signal, viewChild } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DataTableComponent } from '../../../../../core/components/data-table/data-table.component';
import { IReporteExcel } from '../../../../../core/components/data-table/data-table.model';
import { DataTableModule } from '../../../../../core/components/data-table/data-table.module';
import { FormCrudComponent } from '../../../../../core/components/form-crud/form-crud.component';
import { FormFilterComponent } from '../../../../../core/components/form-crud/form-filter/form-filter.component';
import { FormListComponent } from '../../../../../core/components/form-crud/form-list/form-list.component';
import { MaterialModule } from '../../../../../core/modules/material/material.module';
import { CotizacionCompraService } from '../../../../../core/services/contizaciocompra/contizacioncompra.service';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-listar-contizacion',
  imports: [CommonModule, MaterialModule, MatDatepickerModule, MatNativeDateModule, FormCrudComponent, FormFilterComponent, FormListComponent, DataTableModule, ReactiveFormsModule],
  templateUrl: './listar-contizacion.component.html',
  styleUrl: './listar-contizacion.component.css',
})
export class ListarContizacionComponent {
  filtros = model<any>();

  filtroForm = new FormGroup({
    buscador: new FormControl(),
    fechaDesde: new FormControl(null),
    fechaHasta: new FormControl(null),
  });

  urlApi = signal('');
  dataTable = viewChild(DataTableComponent);

  private router = inject(Router);
  private snack = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  private service = inject(CotizacionCompraService);

  configuracionExcel: IReporteExcel = {
    titulo: 'Cotizaciones de Compra',
    fuente: 'Cotización de compra',
    columnas: [
      { titulo: 'ID', propiedad: 'id' },
      { titulo: 'BOM', propiedad: 'bomId' },
      { titulo: 'Cant. Fabricación', propiedad: 'cantidadFabricacion' },
      { titulo: 'Total', propiedad: 'total' },
      { titulo: 'Fecha', propiedad: 'creadoEn' },
      { titulo: 'Activo', propiedad: 'activo' },
      { titulo: 'Actions', propiedad: 'actions' },
    ],
  };

  ngOnInit(): void {
    this.urlApi = signal(this.service.urlCotizacionCompraService);
    this.buscar();
  }

  buscar(): void {
    this.dataTable()?.recargarTabla();
  }

  aplicarFiltros(): void {
    const { buscador } = this.filtroForm.getRawValue();
    this.filtros.set({
      buscador: buscador?.trim() || null,
    });
    this.dataTable()?.recargarTabla();
  }

  crear() {
    this.router.navigate(['/admin/fabricacion/mf/cotizacion']);
  }

  editar(row: any) {
    this.router.navigate(['/admin/fabricacion/mf/cotizacion'], {
      state: { cotizacionId: row.id },
    });
  }

  ver(row: any) {
    // si tienes modal de visualizar, lo abres aquí
    this.router.navigate(['/admin/fabricacion/mf/cotizacion'], {
      state: { cotizacionId: row.id, viewMode: true },
    });
  }

  anular(row: any) {
    this.service.anular(row.id).subscribe({
      next: () => {
        this.snack.open('Cotización anulada ✅', 'Cerrar', { duration: 2500 });
        this.dataTable()?.recargarTabla();
      },
      error: e => {
        const msg = e?.error?.message ?? 'No se pudo anular ❌';
        this.snack.open(msg, 'Cerrar', { duration: 3500 });
      },
    });
  }
}
