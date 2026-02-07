import { CommonModule } from '@angular/common';
import { Component, model, signal, viewChild } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { DataTableComponent } from '../../../core/components/data-table/data-table.component';
import { IReporteExcel } from '../../../core/components/data-table/data-table.model';
import { DataTableModule } from '../../../core/components/data-table/data-table.module';
import { FormCrudComponent } from '../../../core/components/form-crud/form-crud.component';
import { FormFilterComponent } from '../../../core/components/form-crud/form-filter/form-filter.component';
import { FormListComponent } from '../../../core/components/form-crud/form-list/form-list.component';
import { MaterialModule } from '../../../core/modules/material/material.module';

import { ClientesService } from '../../../core/services/clientes/clientes.service';
import { EditarClienteComponent } from './editar-cliente/editar-cliente.component';

@Component({
  selector: 'app-clientes',
  imports: [CommonModule, MaterialModule, MatDatepickerModule, MatNativeDateModule, FormCrudComponent, FormFilterComponent, FormListComponent, DataTableModule, ReactiveFormsModule],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css',
})
export class ClientesComponent {
  filtros = model<any>();

  filtroForm = new FormGroup({
    buscador: new FormControl(),
    fechaDesde: new FormControl(),
    fechaHasta: new FormControl(),
  });

  urlApi = signal('');

  dataTable = viewChild(DataTableComponent);

  configuracionExcel: IReporteExcel = {
    titulo: 'Lista de pedidos',
    fuente: 'Order de pedidos',

    columnas: [
      { titulo: 'Codigo', propiedad: 'codigo' },
      { titulo: 'Origen', propiedad: 'origen' },
      { titulo: 'fechaCrea', propiedad: 'fechaCrea' },
      { titulo: 'fechaCrea', propiedad: 'fechaEntrega' },
      { titulo: 'nombreCliente', propiedad: 'nombreCliente' },
      { titulo: 'Doc_Cliente', propiedad: 'docCliente' },
      { titulo: 'Direccion', propiedad: 'direccion' },
      { titulo: 'Total', propiedad: 'total' },
      { titulo: 'observacion', propiedad: 'observacion' },
      { titulo: 'status', propiedad: 'status' },
      { titulo: 'tipoPago', propiedad: 'tipoPago' },
      { titulo: 'pagoEfectivo', propiedad: 'pagoEfectivo' },
      { titulo: 'otroModoPago', propiedad: 'otroModoPago' },
      { titulo: 'usuarioCrea', propiedad: 'usuarioCrea' },
      { titulo: 'Actions', propiedad: 'actions' },
    ],
  };

  constructor(private dialog: MatDialog, private clientesService: ClientesService) {}

  ngOnInit(): void {
    console.log('URL del servicio:', this.clientesService.urlConsultarPedidos);
    this.urlApi = signal(this.clientesService.urlConsultarPedidos);

    console.log('URL asignada:', this.urlApi());
    this.buscar();
  }

  buscar(): void {
    console.log('buscar');
    this.dataTable()?.recargarTabla();
  }
  aplicarFiltros(): void {
    const { buscador, fechaDesde, fechaHasta } = this.filtroForm.getRawValue();
    this.filtros.set({
      buscador: buscador?.trim() || null,
    });
    this.dataTable()?.recargarTabla(); // dispara la petición al backend
  }
  crearCliente(): void {
    const dialogRef = this.dialog.open(EditarClienteComponent, {
      width: '55rem', // coincide con max-w-3xl
      maxWidth: '95vw',
      data: {
        title: 'Crear Cliente ',
        boton: 'Guardar',
      },
    });

    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        this.buscar();
      }
    });
  }
  editarCliente(cliente: any): void {
    const dialogRef = this.dialog.open(EditarClienteComponent, {
      width: '55rem', // coincide con max-w-3xl
      maxWidth: '95vw',
      data: {
        title: 'Editar Cliente ',
        boton: 'Actualizar',
        cliente: cliente.datos,
      },
    });

    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        this.buscar();
      }
    });
  }
  eliminarCliente(cliente: any): void {
    this.clientesService.eliminarCliente(cliente.id).subscribe({
      next: () => {
        this.buscar();
      },
      error: error => {
        console.error('Error al eliminar el cliente:', error);
      },
    });
  }
}
