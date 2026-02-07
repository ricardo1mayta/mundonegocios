import { CommonModule } from '@angular/common';
import { Component, inject, model, OnInit, signal, viewChild } from '@angular/core';
import { MaterialModule } from '../../../core/modules/material/material.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormCrudComponent } from '../../../core/components/form-crud/form-crud.component';
import { FormFilterComponent } from '../../../core/components/form-crud/form-filter/form-filter.component';
import { FormListComponent } from '../../../core/components/form-crud/form-list/form-list.component';
import { DataTableModule } from '../../../core/components/data-table/data-table.module';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { DataTableComponent } from '../../../core/components/data-table/data-table.component';
import { IReporteExcel } from '../../../core/components/data-table/data-table.model';
import { PedidosService } from '../../../core/services/pedidos/pedidos.service';

import { Router } from '@angular/router';
import { Compra } from '../../../core/models/compras/compra';
import { Pedido } from '../../../core/models/ventas/pedidos';
import { environment } from '../../../../environments/environment';
import { NuevaCotizacionComponent } from './nueva-cotizacion/nueva-cotizacion.component';
import { CotizacionesService } from '../../../core/services/cotizaciones/cotizaciones.service';
import { VisualizarCotizacionComponent } from './visualizar-cotizacion/visualizar-cotizacion.component';
@Component({
  selector: 'app-cotizaciones',
  imports: [CommonModule, MaterialModule, MatDatepickerModule, MatNativeDateModule, FormCrudComponent, FormFilterComponent, FormListComponent, DataTableModule, ReactiveFormsModule],
  templateUrl: './cotizaciones.component.html',
  styleUrl: './cotizaciones.component.css',
  providers: [provideNativeDateAdapter()],
})
export class CotizacionesComponent implements OnInit {
  filtros = model<any>();

  filtroForm = new FormGroup({
    buscador: new FormControl(),
    fechaDesde: new FormControl(),
    fechaHasta: new FormControl(),
  });

  urlApi = signal('');
  private router = inject(Router);
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

  constructor(private dialog: MatDialog, private pedidosService: CotizacionesService) {}

  ngOnInit(): void {
    console.log('URL del servicio:', this.pedidosService.urlConsultarPedidos);
    this.urlApi = signal(this.pedidosService.urlConsultarPedidos);

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

  crearPedido(): void {
    this.router.navigate(['/admin/cotizaciones/newcotizacion']);
  }
  editarPedido(pedido: Pedido) {
    this.router.navigate(['/admin/cotizaciones/newcotizacion'], {
      state: { compraId: pedido.id },
    });
  }

  viewPdf(id: number) {
    this.pedidosService.obtenerTiketPorId(id).subscribe((pdfData: Blob) => {
      const pdfUrl = URL.createObjectURL(pdfData);
      window.open(pdfUrl, '_blank');
    });
  }

  downloadPdf(id: number) {
    this.pedidosService.obtenerTiketPorId(id).subscribe((blob: Blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ticket-${id}.pdf`; // ← nombre que recibirá el archivo
      a.click();
      URL.revokeObjectURL(url); // libera memoria
    });
  }
  generarPedido(pedido: Pedido) {
    this.router.navigate(['/admin/ventas/newpedidos'], {
      state: { cotizacionId: pedido.id },
    });
  }
  verCotizacion(pedido: Pedido) {
    // abrir modal
    const dialogRef = this.dialog.open(VisualizarCotizacionComponent, {
      width: '70rem', // coincide con max-w-3xl
      maxWidth: '95vw',
      data: {
        title: 'Crear Cliente ',
        boton: 'Guardar',
        pedido: pedido,
      },
    });

    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
      }
    });
  }
}
