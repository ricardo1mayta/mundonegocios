import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

import { CotizacionCompraService } from '../../../../../../core/services/contizaciocompra/contizacioncompra.service';
import { BomService } from '../../../../../../core/services/bom/bom.service'; // ✅

@Component({
  selector: 'app-cotizacion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cotizacion.component.html',
  styleUrls: ['./cotizacion.component.css'],
})
export class CotizacionComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private api = inject(CotizacionCompraService);
  private apiBom = inject(BomService); // ✅

  loading = signal(false);
  cotizacionId = signal<number | null>(null);

  total = signal(0);
  activo = signal(true);
  creadoEn = signal<string | null>(null);
  nombreBom = signal<string | null>(null);

  // detalle para grilla
  detalles = signal<any[]>([]);

  // opcional para mostrar cabecera BOM
  bomInfo = signal<any | null>(null);

  form = this.fb.group({
    bomId: this.fb.control<number | null>(null, { validators: [Validators.required] }),
    cantidadFabricacion: this.fb.control<number>(1, { validators: [Validators.required, Validators.min(0.000001)] }),
  });

  constructor() {
    const nav = this.router.getCurrentNavigation();
    const cotizacionId = nav?.extras.state?.['cotizacionId'] as number | undefined;
    const bomId = nav?.extras.state?.['bomId'] as number | undefined;

    if (cotizacionId) {
      this.cotizacionId.set(cotizacionId);
      this.cargarCotizacion(cotizacionId);
      return;
    }

    // ✅ Si no hay cotizacionId pero sí bomId => cargar BOM para previsualizar grilla
    if (bomId) {
      this.form.get('bomId')?.setValue(bomId, { emitEvent: false });
      this.cargarBomPreview(bomId);
    }
  }
  ngOnInit() {
    this.form.get('bomId')?.valueChanges.subscribe(() => {
      this.detalles.set([]); // opcional: limpia para forzar preview
      this.total.set(0);
    });
  }
  // =========================
  // CARGAR COTIZACION
  // =========================
  private cargarCotizacion(id: number) {
    this.loading.set(true);
    this.api
      .obtenerPorId(id)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (resp: any) => {
          const c = resp?.data ?? resp;
          if (!c) return;
          console.log(c);
          this.nombreBom.set(c.nombre);
          this.form.patchValue({
            bomId: Number(c.bomId ?? c.idBom ?? null),
            cantidadFabricacion: Number(c.cantidadFabricacion ?? 0),
          });

          this.total.set(Number(c.total ?? 0));
          this.activo.set(Boolean(c.activo ?? true));
          this.creadoEn.set(c.creadoEn ?? c.fecha ?? null);

          this.detalles.set(Array.isArray(c.detalles) ? c.detalles : []);
        },
        error: () => this.detalles.set([]),
      });
  }

  // =========================
  //  CARGAR BOM (PREVIEW)
  // =========================
  private cargarBomPreview(bomId: number) {
    this.loading.set(true);

    this.apiBom
      .obtenerBomPorId(bomId)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (resp: any) => {
          const bom = resp?.data ?? resp;
          if (!bom) return;

          // guardar info del BOM para mostrar arriba si quieres
          this.bomInfo.set(bom);

          // llenar grilla desde BOM (previsualización)
          const det = (bom.detalles ?? []).map((d: any) => {
            const cantidadUnitBom = Number(d.cantidadPorUnidad ?? 0);
            const mermaPct = Number(d.mermaPct ?? 0);
            const factor = 1 + mermaPct / 100;

            const cantidadUnitReal = Number((cantidadUnitBom * factor).toFixed(6));
            const cantidadFabricacion = Number(this.form.get('cantidadFabricacion')?.value ?? 0);
            const cantidadRequerida = Number((cantidadUnitReal * cantidadFabricacion).toFixed(6));

            const costoUnitCompra = Number(d.costoUnitCompra ?? 0);
            const stockDisponible = 0;
            const cantidadComprar = Math.max(0, Number((cantidadRequerida - stockDisponible).toFixed(6)));
            const total = Number((cantidadComprar * costoUnitCompra).toFixed(2));

            return {
              // ids / nombres
              idInsumo: d.insumo?.id ?? d.idInsumo ?? null,
              insumoNombre: d.insumo?.nombre ?? d.insumoTxt ?? '',

              // cantidades
              cantidadUnitBom,
              mermaPct,
              cantidadUnitReal,
              cantidadRequerida,

              // compra
              stockDisponible,
              cantidadComprar,
              costoUnitCompra,
              total,
            };
          });

          this.detalles.set(det);

          // total cabecera (preview)
          const sum = det.reduce((acc: number, x: any) => acc + Number(x.total ?? 0), 0);
          this.total.set(Number(sum.toFixed(2)));

          // en preview (aún no existe cotización real)
          this.activo.set(true);
          this.creadoEn.set(null);
        },
        error: () => {
          this.bomInfo.set(null);
          this.detalles.set([]);
          this.total.set(0);
        },
      });
  }

  // =========================
  // GUARDAR / GENERAR
  // =========================
  guardar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const payload = this.form.getRawValue();

    const id = this.cotizacionId();
    const req$ = id ? this.api.editar(id, payload as any) : this.api.registrarCotizacion(payload as any);

    req$.pipe(finalize(() => this.loading.set(false))).subscribe({
      next: (r: any) => {
        // si creas, te devuelve id
        if (!id) {
          const newId = r?.data?.id;
          if (newId) this.cotizacionId.set(Number(newId));
        }
        const finalId = this.cotizacionId();
        if (finalId) this.cargarCotizacion(finalId);
      },
    });
  }

  // (opcional) si cambia cantidadFabricacion en preview => recalcular grilla en frontend
  onCantidadFabricacionChange() {
    const bomId = this.form.get('bomId')?.value;
    if (!this.cotizacionId() && bomId) {
      this.cargarBomPreview(Number(bomId)); // simple, recarga y recalcula
    }
  }

  volver() {
    this.router.navigate(['/admin/fabricacion/mf/cotizaciones-compra']);
  }

  trackById = (_: number, item: any) => item?.id ?? item?.idInsumo ?? _;

  onStockChange(row: any, raw: any) {
    const v = Number(raw ?? 0);
    row.stockDisponible = isNaN(v) ? 0 : Math.max(0, Number(v.toFixed(6)));
    this.recalcRow(row);
    this.recalcHeaderTotal();
  }

  private recalcRow(row: any) {
    const requerida = Number(row.cantidadRequerida ?? 0);
    const stock = Number(row.stockDisponible ?? 0);
    const costo = Number(row.costoUnitCompra ?? 0);

    const comprar = Math.max(0, requerida - stock);
    row.cantidadComprar = Number(comprar.toFixed(6));
    row.total = Number((row.cantidadComprar * costo).toFixed(2));
  }

  private recalcHeaderTotal() {
    const det = this.detalles();
    const sum = det.reduce((acc: number, x: any) => acc + Number(x.total ?? 0), 0);
    this.total.set(Number(sum.toFixed(2)));
    // refresca signal (porque editas el objeto “row”)
    this.detalles.set([...det]);
  }

  copiar() {
    this.cotizacionId.set(null);
    this.creadoEn.set(null);
    this.activo.set(true);
    this.recalcHeaderTotal();
  }
  cargarBom() {
    if (this.cotizacionId()) return; // si ya existe cotización, no preview
    const bomId = Number(this.form.get('bomId')?.value ?? 0);
    if (!bomId || bomId <= 0) {
      this.form.get('bomId')?.markAsTouched();
      return;
    }

    // limpia todo antes de cargar
    this.detalles.set([]);
    this.total.set(0);
    this.bomInfo.set(null);

    this.cargarBomPreview(bomId);
  }

  @ViewChild('printArea') printArea!: ElementRef<HTMLElement>;
  imprimir() {
    window.print();
  }
}



