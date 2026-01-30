import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { ReportePedidosService, PageResponse, VwReporteGananciaDetalleDto } from '../../../../../core/services/reportes/reporte-pedidos.service';

type PageLike<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
};
@Component({
  selector: 'app-compras-producto-detallado',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatButtonModule, MatTableModule, MatPaginatorModule, DatePipe],
  templateUrl: './compras-producto-detallado.component.html',
  styleUrl: './compras-producto-detallado.component.css',
})
export class ComprasProductoDetalladoComponent {
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(ReportePedidosService);
  montoTotalMercaderia = signal(0);
  loading = signal(false);

  // ====== tabla
  page = signal<PageResponse<VwReporteGananciaDetalleDto>>({
    content: [],
    totalElements: 0,
    totalPages: 0,
    size: 10,
    number: 0,
  });

  // ====== filtros
  filtroForm = this.fb.group({
    buscador: [''],
    idSede: [null as number | null],
    fechaDesde: [null as string | null],
    fechaHasta: [null as string | null],
  });

  // ====== totales (sobre lo cargado / página actual)
  totalesView = signal({
    totalItems: 0, // suma de totalItem
    totalCompra: 0, // suma de totalCompra (si viene repetido por item, ojo)
    totalCantidad: 0, // suma de cantidad
    totalMonto: 0, // totalItem (lo mismo que totalItems)
    promedioPrecio: 0, // promedio ponderado por cantidad
  });
  // columnas
  displayedColumns = ['fechaCompra', 'codigo', 'proveedorNombre', 'idProducto', 'descripcionProducto', 'cantidad', 'precio', 'totalItem', 'totalCompra'];

  ngOnInit() {
    const { desde, hasta } = this.getCurrentMonthRange();
    this.filtroForm.patchValue({
      fechaDesde: this.toYmd(desde),
      fechaHasta: this.toYmd(hasta),
    });

    this.buscar(0, this.page().size);
  }

  onPage(e: PageEvent) {
    this.buscar(e.pageIndex, e.pageSize);
  }

  aplicarFiltros() {
    this.buscar(0, this.page().size);
  }

  limpiar() {
    this.filtroForm.reset({ buscador: '', idSede: null, fechaDesde: null, fechaHasta: null });
    this.buscar(0, this.page().size);
  }
  private toNum(v: any): number {
    const n = Number(v);
    return isNaN(n) ? 0 : n;
  }
  private calcTotales(rows: any[]) {
    const toNum = (v: any) => {
      const n = Number(v);
      return isNaN(n) ? 0 : n;
    };

    const totalCantidad = rows.reduce((acc, r) => acc + toNum(r?.cantidad), 0);
    const totalItems = rows.reduce((acc, r) => acc + toNum(r?.totalItem), 0);

    // totalCompra: si tu API lo repite por cada detalle, NO sumes directo.
    // Mejor: sumar una sola vez por idCompra
    const comprasUnicas = new Map<number, number>();
    rows.forEach(r => {
      const id = toNum(r?.idCompra);
      if (!id) return;
      if (!comprasUnicas.has(id)) comprasUnicas.set(id, toNum(r?.totalCompra));
    });
    const totalCompra = Array.from(comprasUnicas.values()).reduce((a, b) => a + b, 0);

    // promedio ponderado: (sum(precio*cantidad))/sum(cantidad)
    const sumaPrecioXCant = rows.reduce((acc, r) => acc + toNum(r?.precio) * toNum(r?.cantidad), 0);
    const promedioPrecio = totalCantidad > 0 ? sumaPrecioXCant / totalCantidad : 0;

    this.totalesView.set({
      totalItems,
      totalCompra,
      totalCantidad,
      totalMonto: totalItems,
      promedioPrecio,
    });
  }
  buscar(pagina = 0, tamanio = 10) {
    const f = this.filtroForm.getRawValue();

    const payload = {
      pagina,
      tamanio,
      datos: {
        buscador: f.buscador?.trim() || null,
        idSede: f.idSede ?? null,
        fechaDesde: f.fechaDesde ?? null,
        fechaHasta: f.fechaHasta ?? null,
      },
    };

    this.loading.set(true);
    this.service
      .listarPaginadoCompras(payload)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res: any) => {
          const d = res?.data;

          const rows = (d?.lista ?? []) as VwReporteGananciaDetalleDto[];

          // mapeo a un page estándar para la tabla/paginador
          this.page.set({
            content: rows,
            totalElements: Number(d?.totalRegistros ?? 0),
            totalPages: Number(d?.totalPaginas ?? 0),
            size: Number(tamanio),
            number: Number(d?.paginaActual ?? pagina),
          });

          // <-- SUMATORIAS
          this.calcTotales(rows);
        },
        error: () => {
          this.page.set({
            content: [],
            totalElements: 0,
            totalPages: 0,
            size: tamanio,
            number: pagina,
          });
          this.calcTotales([]);
        },
      });
  }

  private getCurrentMonthRange(): { desde: Date; hasta: Date } {
    const now = new Date();
    const desde = new Date(now.getFullYear(), now.getMonth(), 1);
    const hasta = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return { desde, hasta };
  }

  private toYmd(d: Date): string {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
}
