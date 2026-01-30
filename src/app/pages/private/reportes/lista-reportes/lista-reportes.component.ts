import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';

import { ReportePedidosService } from '../../../../core/services/reportes/reporte-pedidos.service';
import { VentasProductoDetalladoComponent } from './ventas-producto-detallado/ventas-producto-detallado.component';
import { ComprasProductoDetalladoComponent } from './compras-producto-detallado/compras-producto-detallado.component';
type KpiKey = 'ventas' | 'compras';
@Component({
  selector: 'app-lista-reportes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatButtonModule, MatTableModule, MatPaginatorModule, VentasProductoDetalladoComponent, ComprasProductoDetalladoComponent],
  templateUrl: './lista-reportes.component.html',
})
export class ListaReportesComponent {
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(ReportePedidosService);
  montoTotalMercaderia = signal(0);
  loading = signal(false);

  selectedKpi = signal<'ventas' | 'compras'>('ventas');

  selectKpi(k: 'ventas' | 'compras') {
    this.selectedKpi.set(k);
    setTimeout(() => document.getElementById('kpi-detalle')?.scrollIntoView({ behavior: 'smooth' }), 0);
  }
  // ====== filtros
  filtroForm = this.fb.group({
    buscador: [''],
    idSede: [null as number | null],
    fechaDesde: [null as string | null],
    fechaHasta: [null as string | null],
  });

  // ====== totales (sobre lo cargado / página actual)
  totalesView = signal({
    ventaBruta: 0,
    descuento: 0,
    impuesto: 0,
    costoTotal: 0,
    gananciaBruta: 0,
    gananciaNeta: 0,
  });

  ngOnInit() {
    this.cargarKpiMontoTotalMercaderia();
  }
  cargarKpiMontoTotalMercaderia() {
    this.service.montoTotalMercaderia().subscribe((res: any) => {
      const v = res?.data ?? 0;
      this.montoTotalMercaderia.set(Number(v) || 0);
    });
  }
}
