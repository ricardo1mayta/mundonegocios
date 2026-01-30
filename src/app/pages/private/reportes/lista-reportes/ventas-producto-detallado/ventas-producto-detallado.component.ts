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
  selector: 'app-ventas-producto-detallado',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatButtonModule, MatTableModule, MatPaginatorModule, DatePipe],
  templateUrl: './ventas-producto-detallado.component.html',
  styleUrl: './ventas-producto-detallado.component.css',
})
export class VentasProductoDetalladoComponent {
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
    ventaBruta: 0,
    descuento: 0,
    impuesto: 0,
    costoTotal: 0,
    gananciaBruta: 0,
    gananciaNeta: 0,
  });

  // columnas
  displayedColumns: (keyof VwReporteGananciaDetalleDto | 'acciones')[] = [
    'fechaDia',
    'codigoPedido',
    'docCliente',
    'cliente',
    'producto',
    'cantidad',
    'precioVentaUnit',
    'costoUnitario',
    'ventaBruta',
    'descuento',
    'impuesto',
    'gananciaBruta',
    'gananciaNeta',
  ];

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
    const sum = (key: string) => rows.reduce((acc, r) => acc + this.toNum(r?.[key]), 0);
    const costoTotal = rows.reduce((acc, r) => acc + this.toNum(r.cantidad) * this.toNum(r.costoUnitario), 0);
    this.totalesView.set({
      ventaBruta: sum('ventaBruta'),
      descuento: sum('descuento'),
      impuesto: sum('impuesto'),
      costoTotal,
      gananciaBruta: sum('gananciaBruta'),
      gananciaNeta: sum('gananciaNeta'),
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
      .listarPaginado(payload)
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
