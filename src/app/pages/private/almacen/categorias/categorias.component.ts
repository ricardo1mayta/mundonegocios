import { CommonModule } from '@angular/common';
import { Component, model, signal, ViewChild, viewChild } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, FormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { DataTableComponent } from '../../../../core/components/data-table/data-table.component';
import { IReporteExcel } from '../../../../core/components/data-table/data-table.model';
import { DataTableModule } from '../../../../core/components/data-table/data-table.module';
import { FormCrudComponent } from '../../../../core/components/form-crud/form-crud.component';
import { FormFilterComponent } from '../../../../core/components/form-crud/form-filter/form-filter.component';
import { FormListComponent } from '../../../../core/components/form-crud/form-list/form-list.component';
import { MaterialModule } from '../../../../core/modules/material/material.module';
import { ClientesService } from '../../../../core/services/clientes/clientes.service';
import { EditarClienteComponent } from '../../clientes/editar-cliente/editar-cliente.component';
import { MarcasService } from '../../../../core/services/marcas/marcas.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { Marca } from '../../../../core/models/almacen/marca';
import { CrearCategoriaComponent } from './crear-categoria/crear-categoria.component';
import { CateboriasService } from '../../../../core/services/categorias/cateborias.service';

@Component({
  selector: 'app-categorias',
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
  ],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.css',
})
export class CategoriasComponent {
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
    titulo: 'Lista de pedidos',
    fuente: 'Order de pedidos',

    columnas: [{ titulo: 'Codigo', propiedad: 'codigo' }],
  };

  constructor(private dialog: MatDialog, private marcaService: CateboriasService) {}

  ngOnInit(): void {
    console.log('URL del servicio:', this.marcaService.urlListarCategorias);
    this.urlApi = signal(this.marcaService.urlListarCategorias);

    console.log('URL asignada:', this.urlApi());
    this.buscar();
  }

  buscar(): void {
    console.log('buscar');
    this.dataTable?.recargarTabla();
  }

  crearMarca(): void {
    const dialogRef = this.dialog.open(CrearCategoriaComponent, {
      width: '90%',
      data: {
        title: 'Crear Cliente Api Key',
        boton: 'Guardar',
      },
    });

    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        this.buscar();
      }
    });
  }
  // eliminarMarca
  eliminarMarca(marca: Marca): void {
    this.marcaService.eliminarCategoria(marca.id).subscribe({
      next: () => {
        this.buscar();
      },
      error: error => {
        console.error('Error al eliminar la marca:', error);
      },
    });
  }
  // editar
  editarMarca(marca: Marca): void {
    const dialogRef = this.dialog.open(CrearCategoriaComponent, {
      width: '90%',
      data: marca,
    });

    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        this.buscar();
      }
    });
  }
}
