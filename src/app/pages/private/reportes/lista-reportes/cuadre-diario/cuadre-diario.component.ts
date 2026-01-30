import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { finalize } from 'rxjs';
import { ReportePedidosService, PageResponse } from '../../../../../core/services/reportes/reporte-pedidos.service';

export type VwVentasCuadrePagoDto = {
  idRom?: number | null;
  fecha: string; // "2026-01-29"
  codigo: number;
  tipoPagoNombre: string;
  total: number;
};

@Component({
  selector: 'app-cuadre-diario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatButtonModule, MatTableModule, MatPaginatorModule, DatePipe],
  templateUrl: './cuadre-diario.component.html',
  styleUrl: './cuadre-diario.component.css',
})
export class CuadreDiarioComponent {
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(ReportePedidosService);

  loading = signal(false);

  // ===== tabla
  page = signal<PageResponse<VwVentasCuadrePagoDto>>({
    content: [],
    totalElements: 0,
    totalPages: 0,
    size: 10,
    number: 0,
  });

  // ===== filtros
  filtroForm = this.fb.group({
    buscador: [''],
    idSede: [null as number | null],
    fechaDesde: [null as string | null],
    fechaHasta: [null as string | null],
  });

  // ===== totales dinámicos (sobre lo cargado / página actual)
  totalesView = signal({
    registros: 0,
    totalVentas: 0,
    porTipo: [] as Array<{ tipo: string; monto: number; count: number }>,
  });

  // columnas
  displayedColumns = ['fecha', 'codigo', 'tipoPagoNombre', 'total'];

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

  // trackBy para tarjetas dinámicas
  trackTipo = (_: number, item: { tipo: string }) => item.tipo;

  private toNum(v: any): number {
    const n = Number(v);
    return isNaN(n) ? 0 : n;
  }

  private normTipo(v: any): { key: string; label: string } {
    const label = (v ?? '').toString().trim();
    const key = label.toUpperCase() || 'SIN TIPO';
    return { key, label: label || 'SIN TIPO' };
  }

  // ✅ agrupar dinámicamente por tipoPagoNombre
  private calcTotales(rows: VwVentasCuadrePagoDto[]) {
    const map = new Map<string, { tipo: string; monto: number; count: number }>();

    let totalVentas = 0;

    for (const r of rows) {
      const { key, label } = this.normTipo(r?.tipoPagoNombre);
      const monto = this.toNum(r?.total);

      totalVentas += monto;

      const cur = map.get(key);
      if (cur) {
        cur.monto += monto;
        cur.count += 1;
      } else {
        map.set(key, { tipo: label, monto, count: 1 });
      }
    }

    const porTipo = Array.from(map.values()).sort((a, b) => b.monto - a.monto);

    this.totalesView.set({
      registros: rows.length,
      totalVentas,
      porTipo,
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
      .listarPaginadoCuadre(payload)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res: any) => {
          const d = res?.data;

          const rows = (d?.lista ?? []) as VwVentasCuadrePagoDto[];

          this.page.set({
            content: rows,
            totalElements: Number(d?.totalRegistros ?? 0),
            totalPages: Number(d?.totalPaginas ?? 0),
            size: Number(tamanio),
            number: Number(d?.paginaActual ?? pagina),
          });

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
