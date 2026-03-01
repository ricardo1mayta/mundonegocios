import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatInputModule } from "@angular/material/input";
import { forkJoin, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { CuadreDiarioService } from "../../../../core/services/cuadre-diario/cuadre-diario.service";
import { ReportePedidosService } from "../../../../core/services/reportes/reporte-pedidos.service";

@Component({
  selector: "app-cuadre-caja",
  standalone: true,
  imports: [CommonModule, FormsModule, MatDatepickerModule, MatNativeDateModule, MatInputModule],
  templateUrl: "./cuadre-caja.component.html",
  styleUrl: "./cuadre-caja.component.css",
})
export class CuadreCajaComponent {
  private cuadreService = inject(CuadreDiarioService);
  private reporteService = inject(ReportePedidosService);

  fecha = new Date();
  cargando = false;
  error: string | null = null;

  cuadreId: number | null = null;

  ventasTotal = 0;
  ventasPorTipoPago: { tipoPago: string; total: number }[] = [];
  comprasTotal = 0;
  gastosTotal = 0;
  montoMercaderiaKpi = 0;

  dineroEnCaja: number | null = null;
  dineroEnCuentas: number | null = null;
  mercaderia: number | null = null;
  mercaderiaEnCamino: number | null = null;
  saldoInicial: number | null = null;

  ngOnInit(): void {
    this.cargarTodo();
  }

  onFechaChange() {
    this.cargarTodo();
  }

  private formatDate(d: Date): string {
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }

  private num(v: any): number {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }

  get saldoFinal(): number {
    return this.num(this.saldoInicial) + this.ventasTotal - this.comprasTotal - this.gastosTotal;
  }

  get gananciaDiaria(): number {
    return this.ventasTotal - this.comprasTotal - this.gastosTotal;
  }

  get capitalActual(): number {
    return (
      this.num(this.dineroEnCaja) +
      this.num(this.dineroEnCuentas) +
      this.num(this.mercaderia) +
      this.num(this.mercaderiaEnCamino)
    );
  }

  get aumentoCapital(): number {
    return this.capitalActual - this.num(this.saldoInicial);
  }

  get diferencia(): number {
    return this.capitalActual - this.saldoFinal;
  }

  private cargarTodo() {
    this.cargando = true;
    this.error = null;

    forkJoin({
      cuadre: this.cuadreService.getCuadre(this.formatDate(this.fecha)).pipe(catchError(() => of(null))),
      ventas: this.cuadreService.getVentas(this.formatDate(this.fecha)).pipe(catchError(() => of(null))),
      compras: this.cuadreService.getCompras(this.formatDate(this.fecha)).pipe(catchError(() => of(null))),
      gastos: this.cuadreService.getGastos(this.formatDate(this.fecha)).pipe(catchError(() => of(null))),
      mercaderiaKpi: this.reporteService.montoTotalMercaderia().pipe(catchError(() => of(null))),
    }).subscribe({
      next: ({ cuadre, ventas, compras, gastos, mercaderiaKpi }) => {
        const cuadreData = cuadre?.data ?? cuadre ?? null;
        if (cuadreData?.id) {
          this.cuadreId = cuadreData.id;
          this.dineroEnCuentas = cuadreData?.dineroEnCuentas ?? this.dineroEnCuentas;
          this.dineroEnCaja = cuadreData?.dineroEnCaja ?? this.dineroEnCaja;
          this.mercaderia = cuadreData?.mercaderia ?? this.mercaderia;
          this.mercaderiaEnCamino = cuadreData?.mercaderiaEnCamino ?? this.mercaderiaEnCamino;
          this.saldoInicial = cuadreData?.saldoInicial ?? this.saldoInicial;
          if (Array.isArray(cuadreData?.ventasPorTipoPago)) {
            this.ventasPorTipoPago = cuadreData.ventasPorTipoPago;
          }
          if (cuadreData?.ventasTotal != null) {
            this.ventasTotal = this.num(cuadreData.ventasTotal);
          }
          if (cuadreData?.comprasTotal != null) {
            this.comprasTotal = this.num(cuadreData.comprasTotal);
          }
          if (cuadreData?.gastosTotal != null) {
            this.gastosTotal = this.num(cuadreData.gastosTotal);
          }
        } else {
          this.cuadreId = null;
        }

        const ventasData = ventas?.data ?? ventas ?? null;
        const ventasLista = Array.isArray(ventasData?.ventasPorTipoPago)
          ? ventasData.ventasPorTipoPago
          : Array.isArray(ventasData)
          ? ventasData
          : [];
        if (ventasLista.length) {
          this.ventasPorTipoPago = ventasLista;
          this.ventasTotal = ventasLista.reduce((s: number, v: any) => s + this.num(v?.total), 0);
        } else if (ventasData?.total != null) {
          this.ventasTotal = this.num(ventasData.total);
        }

        const comprasData = compras?.data ?? compras ?? null;
        if (comprasData?.total != null) {
          this.comprasTotal = this.num(comprasData.total);
        }

        const gastosData = gastos?.data ?? gastos ?? null;
        const gastosLista = Array.isArray(gastosData?.gastos)
          ? gastosData.gastos
          : Array.isArray(gastosData)
          ? gastosData
          : [];

        if (gastosLista.length) {
          this.gastosTotal = gastosLista.reduce((s: number, g: any) => s + this.num(g?.monto ?? g?.total ?? g?.importe), 0);
        } else if (gastosData?.total != null) {
          this.gastosTotal = this.num(gastosData.total);
        }

        const mercaderiaKpiData = (mercaderiaKpi as any)?.data ?? mercaderiaKpi ?? 0;
        this.montoMercaderiaKpi = this.num(mercaderiaKpiData);

        if (!this.cuadreId && this.mercaderia == null) {
          this.mercaderia = this.montoMercaderiaKpi;
        }

        this.cargando = false;
      },
      error: () => {
        this.error = "No se pudieron cargar los datos del cuadre.";
        this.cargando = false;
      },
    });
  }

  usarMontoMercaderiaKpi() {
    this.mercaderia = this.montoMercaderiaKpi;
  }

  guardar() {
    this.error = null;
    const payload = {
      fecha: this.formatDate(this.fecha),
      ventasTotal: this.ventasTotal,
      ventasPorTipoPago: this.ventasPorTipoPago,
      comprasTotal: this.comprasTotal,
      gastosTotal: this.gastosTotal,
      dineroEnCaja: this.num(this.dineroEnCaja),
      dineroEnCuentas: this.num(this.dineroEnCuentas),
      mercaderia: this.num(this.mercaderia),
      mercaderiaEnCamino: this.num(this.mercaderiaEnCamino),
      saldoInicial: this.num(this.saldoInicial),
      gananciaDiaria: this.gananciaDiaria,
      capitalActual: this.capitalActual,
      aumentoCapital: this.aumentoCapital,
      saldoFinal: this.saldoFinal,
      diferencia: this.diferencia,
    };

    const req$ = this.cuadreId ? this.cuadreService.actualizarCuadre(this.cuadreId, payload) : this.cuadreService.crearCuadre(payload);
    req$.subscribe({
      next: (res: any) => {
        const status = res?.status ?? res?.body?.status?.code ?? res?.body?.status;
        if (status === 201 || status === 200) {
          const data = res?.body?.data ?? res?.body ?? null;
          if (data?.id) this.cuadreId = data.id;
        }
      },
      error: () => {
        this.error = "No se pudo guardar el cuadre.";
      },
    });
  }
}