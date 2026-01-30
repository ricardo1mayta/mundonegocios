import { CommonModule } from '@angular/common';
import { Component, model, signal, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DataTableComponent } from '../../../../core/components/data-table/data-table.component';
import { IReporteExcel } from '../../../../core/components/data-table/data-table.model';
import { DataTableModule } from '../../../../core/components/data-table/data-table.module';
import { FormCrudComponent } from '../../../../core/components/form-crud/form-crud.component';
import { FormFilterComponent } from '../../../../core/components/form-crud/form-filter/form-filter.component';
import { FormListComponent } from '../../../../core/components/form-crud/form-list/form-list.component';
import { Usuario } from '../../../../core/models/usuario';
import { MaterialModule } from '../../../../core/modules/material/material.module';
import { NuevoUsuarioComponent } from '../nuevo-usuario/nuevo-usuario.component';
import { UsuarioService } from '../../../../core/services/usuario/usuario.service';

@Component({
  selector: 'app-usuarios',
  imports: [CommonModule, MaterialModule, MatSlideToggleModule, FormCrudComponent, FormFilterComponent, FormListComponent, DataTableModule, ReactiveFormsModule, FormsModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css',
})
export class UsuariosComponent {
  filtros = model<any>();

  filtroForm = new FormGroup({
    buscador: new FormControl(),
    activo: new FormControl<boolean | null>(null),
  });

  urlApi = signal('');

  @ViewChild(DataTableComponent)
  dataTable!: DataTableComponent;

  configuracionExcel: IReporteExcel = {
    titulo: 'Lista de Usuarios',
    fuente: 'Reporte de usuarios',
    columnas: [
      { titulo: 'ID', propiedad: 'idUser' },
      { titulo: 'Username', propiedad: 'username' },
      { titulo: 'Correo', propiedad: 'emailUser' },
      { titulo: 'Activo', propiedad: 'activo' },
      { titulo: 'Tipo', propiedad: 'tipoUser' },
      { titulo: 'Nombres', propiedad: 'nombres' },
      { titulo: 'Apellidos', propiedad: 'apellidos' },
    ],
  };

  constructor(private dialog: MatDialog, private usuariosService: UsuarioService) {}

  ngOnInit(): void {
    this.urlApi = signal(this.usuariosService.urlListarUsuarios);
    this.buscar();
  }

  buscar(): void {
    this.dataTable?.recargarTabla();
  }

  crearUsuario(): void {
    const dialogRef = this.dialog.open(NuevoUsuarioComponent, {
      width: '80%',
    });
    dialogRef.afterClosed().subscribe(res => res && this.buscar());
  }

  editarUsuario(usuario: Usuario): void {
    const dialogRef = this.dialog.open(NuevoUsuarioComponent, {
      width: '80%',
      data: usuario,
    });
    dialogRef.afterClosed().subscribe(res => res && this.buscar());
  }

  eliminarUsuario(usuario: Usuario): void {
    this.usuariosService.eliminarUsuario(usuario.idUser!).subscribe({
      next: () => this.buscar(),
      error: err => console.error('Error al eliminar usuario:', err),
    });
  }
}
