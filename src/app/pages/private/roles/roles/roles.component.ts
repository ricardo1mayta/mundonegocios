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
import { RolesService } from '../../../../core/services/roles/roles.service';
import { NuevoRolComponent } from '../nuevo-rol/nuevo-rol.component';
import { Rol } from '../../../../core/models/roles/rol';

@Component({
  selector: 'app-roles',
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
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css',
})
export class RolesComponent {
  filtros = model<any>();

  filtroForm = new FormGroup({
    buscador: new FormControl(),
  });

  urlApi = signal('');

  @ViewChild(DataTableComponent)
  dataTable!: DataTableComponent;

  configuracionExcel: IReporteExcel = {
    titulo: 'Lista de Roles',
    fuente: 'Reporte de roles',
    columnas: [
      { titulo: 'ID', propiedad: 'idRol' },
      { titulo: 'Nombre', propiedad: 'nombreRol' },
      { titulo: 'Descripción', propiedad: 'descripcionRol' },
      { titulo: 'ID Sede', propiedad: 'idSede' },
    ],
  };

  constructor(private dialog: MatDialog, private rolesService: RolesService) {}

  ngOnInit(): void {
    this.urlApi = signal(this.rolesService.urlListarRoles);
    this.buscar();
  }

  buscar(): void {
    this.dataTable?.recargarTabla();
  }

  crearRol(): void {
    const dialogRef = this.dialog.open(NuevoRolComponent, {
      width: '70%',
      data: { title: 'Crear Rol', boton: 'Guardar' },
    });
    dialogRef.afterClosed().subscribe((res: unknown) => res && this.buscar());
  }

  editarRol(rol: Rol): void {
    const dialogRef = this.dialog.open(NuevoRolComponent, {
      width: '70%',
      data: rol,
    });
    dialogRef.afterClosed().subscribe((res: unknown) => res && this.buscar());
  }

  eliminarRol(rol: Rol): void {
    this.rolesService.eliminarRol(rol.idRol).subscribe({
      next: () => this.buscar(),
      error: err => console.error('Error al eliminar el rol:', err),
    });
  }
}
