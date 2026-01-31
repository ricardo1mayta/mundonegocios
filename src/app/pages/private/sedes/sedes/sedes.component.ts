import { CommonModule } from '@angular/common';
import { Component, model, signal, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormControl } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DataTableComponent } from '../../../../core/components/data-table/data-table.component';
import { IReporteExcel } from '../../../../core/components/data-table/data-table.model';
import { DataTableModule } from '../../../../core/components/data-table/data-table.module';
import { FormCrudComponent } from '../../../../core/components/form-crud/form-crud.component';
import { FormFilterComponent } from '../../../../core/components/form-crud/form-filter/form-filter.component';
import { FormListComponent } from '../../../../core/components/form-crud/form-list/form-list.component';
import { MaterialModule } from '../../../../core/modules/material/material.module';
import { NuevaSedeComponent } from '../nueva-sede/nueva-sede.component';
import { Sede } from '../../../../core/models/sedes/sedes';
import { SedesService } from '../../../../core/services/sedes/sedes.service';

@Component({
  selector: 'app-sedes',
  imports: [
    CommonModule,
    MaterialModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    FormCrudComponent,
    FormFilterComponent,
    FormListComponent,
    DataTableModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './sedes.component.html',
  styleUrl: './sedes.component.css',
})
export class SedesComponent {
  filtros = model<any>();

  filtroForm = new FormGroup({
    buscador: new FormControl(),
    fechaDesde: new FormControl(),
    fechaHasta: new FormControl(),
  });

  urlApi = signal('');

  @ViewChild(DataTableComponent)
  dataTable!: DataTableComponent;

  configuracionExcel: IReporteExcel = {
    titulo: 'Lista de sedes',
    fuente: 'Reporte de sedes',
    columnas: [
      { titulo: 'ID', propiedad: 'id' },
      { titulo: 'RUC', propiedad: 'ruc' },
      { titulo: 'Nombre Comercial', propiedad: 'nomComercial' },
      { titulo: 'Razón Social', propiedad: 'razonSocial' },
      { titulo: 'Teléfono', propiedad: 'telefono' },
      { titulo: 'Estado', propiedad: 'status' },
    ],
  };

  constructor(private dialog: MatDialog, private sedesService: SedesService) {}

  ngOnInit(): void {
    this.urlApi = signal(this.sedesService.urlListarSedes);
    this.buscar();
  }

  buscar(): void {
    this.dataTable?.recargarTabla();
  }

  crearSede(): void {
    const dialogRef = this.dialog.open(NuevaSedeComponent, {
      width: '55rem', // coincide con max-w-3xl
      maxWidth: '60rem',
      data: { title: 'Crear Sede', boton: 'Guardar' },
    });
    dialogRef.afterClosed().subscribe((res: unknown) => res && this.buscar());
  }

  editarSede(sede: Sede): void {
    const dialogRef = this.dialog.open(NuevaSedeComponent, {
      width: '55rem', // coincide con max-w-3xl
      maxWidth: '60rem',
      data: sede,
    });
    dialogRef.afterClosed().subscribe((res: unknown) => res && this.buscar());
  }

  eliminarSede(sede: Sede): void {
    this.sedesService.eliminarSede(sede.id).subscribe({
      next: () => this.buscar(),
      error: err => console.error('Error al eliminar la sede:', err),
    });
  }
  duplicar(sede: Sede): void {
    const dialogRef = this.dialog.open(NuevaSedeComponent, {
      width: '55rem', // coincide con max-w-3xl
      maxWidth: '60rem',
      data: { ...sede, tipo: 'duplicate' },
    });
    dialogRef.afterClosed().subscribe((res: unknown) => res && this.buscar());
  }
}
