import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ComprasService } from '../../../../core/services/compras/compras.service';
import { ImeisService } from '../../../../core/services/imeis/imeis.service';

@Component({
  selector: 'app-registro-imeis',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registro-imeis.component.html',
  styleUrl: './registro-imeis.component.css',
})
export class RegistroImeisComponent {
  private comprasService = inject(ComprasService);
  private imeisService = inject(ImeisService);
  private route = inject(ActivatedRoute);

  compra = signal<any>(null);
  selectedDetalleId = signal<number | null>(null);

  imeiInputMap: Record<number, string> = {};
  imeiErrorMap: Record<number, string> = {};
  imeiSavingMap: Record<number, boolean> = {};
  imeiDeletingMap: Record<string, boolean> = {};
  imeiListMap: Record<number, string[]> = {};

  constructor() {
    effect(() => {
      const compraId = Number(this.route.snapshot.paramMap.get('id'));
      if (compraId) {
        this.cargarCompra(compraId);
      }
    });
  }

  private cargarCompra(id: number) {
    this.comprasService.obtenerCompraPorId(id).subscribe((comp: any) => {
      this.compra.set(comp.data);
      this.selectFirstPending();
      this.cargarImeis(id);
    });
  }

  private cargarImeis(compraId: number) {
    this.imeisService.listarPorCompra(compraId).subscribe({
      next: (res: any) => {
        this.imeiListMap = this.normalizeImeiResponse(res);
        this.selectFirstPending();
      },
      error: () => {
        // si el endpoint no existe todavia, no bloquea el UI
      },
    });
  }

  private normalizeImeiResponse(res: any): Record<number, string[]> {
    const map: Record<number, string[]> = {};
    const data = res?.data ?? res ?? [];

    if (Array.isArray(data)) {
      for (const row of data) {
        const detalleId =
          row?.idDetalle ?? row?.idCompraDetalle ?? row?.detalleId ?? row?.id_detalle ?? row?.id_compra_detalle;
        const imei = row?.imei ?? row?.codigo ?? row;
        if (!detalleId || !imei) continue;
        const key = Number(detalleId);
        map[key] = map[key] ?? [];
        map[key].push(String(imei));
      }
      return map;
    }

    if (data && typeof data === 'object') {
      for (const [k, v] of Object.entries(data)) {
        if (Array.isArray(v)) {
          map[Number(k)] = v.map(String);
        }
      }
      return map;
    }

    return map;
  }

  getDetalleId(item: any): number {
    return (
      item?.id ??
      item?.idDetalle ??
      item?.idCompraDetalle ??
      item?.detalleId ??
      item?.id_compra_detalle ??
      0
    );
  }

  productos() {
    return this.compra()?.comprasDetalle ?? [];
  }

  selectedItem() {
    const id = this.selectedDetalleId();
    if (!id) return null;
    return this.productos().find((i: any) => this.getDetalleId(i) === id) ?? null;
  }

  selectItem(item: any) {
    const id = this.getDetalleId(item);
    if (id) this.selectedDetalleId.set(id);
  }

  private selectFirstPending() {
    const items = this.productos();
    if (!items.length) return;
    const pending = items.find((i: any) => this.imeisCount(i) < (i?.cantidad ?? 0));
    const chosen = pending ?? items[0];
    this.selectedDetalleId.set(this.getDetalleId(chosen));
  }

  private getProductoId(item: any): number {
    return item?.productoDetalle?.id ?? item?.idProducto ?? item?.productoId ?? 0;
  }

  getImeis(detalleId: number): string[] {
    return this.imeiListMap[detalleId] ?? [];
  }

  imeisCount(item: any): number {
    const id = this.getDetalleId(item);
    return this.getImeis(id).length;
  }

  totalProductos(): number {
    return this.compra()?.comprasDetalle?.length ?? 0;
  }

  totalRegistrados(): number {
    return (this.compra()?.comprasDetalle ?? []).reduce((s: number, d: any) => s + this.imeisCount(d), 0);
  }

  totalRestantes(): number {
    return (this.compra()?.comprasDetalle ?? []).reduce(
      (s: number, d: any) => s + Math.max(0, (d?.cantidad ?? 0) - this.imeisCount(d)),
      0,
    );
  }

  addImeis(item: any) {
    const detalleId = this.getDetalleId(item);
    const max = Number(item?.cantidad ?? 0);
    const raw = (this.imeiInputMap[detalleId] ?? '').trim();

    this.imeiErrorMap[detalleId] = '';

    if (!raw) return;

    const parts = raw.split(/[\s,;]+/).map((s) => s.trim()).filter(Boolean);
    if (!parts.length) return;

    const invalid = parts.find((p) => !/^\d{14,17}$/.test(p));
    if (invalid) {
      this.imeiErrorMap[detalleId] = `IMEI invalido: ${invalid}`;
      return;
    }

    const current = new Set(this.getImeis(detalleId));
    const seen = new Set<string>();
    const next: string[] = [];
    const duplicates: string[] = [];
    for (const p of parts) {
      if (current.has(p) || seen.has(p)) {
        duplicates.push(p);
        continue;
      }
      seen.add(p);
      next.push(p);
    }

    if (duplicates.length) {
      this.imeiErrorMap[detalleId] = `IMEI repetido: ${duplicates[0]}`;
      return;
    }

    if (max > 0 && current.size + next.length > max) {
      this.imeiErrorMap[detalleId] = 'La cantidad de IMEIs supera la cantidad comprada.';
      return;
    }

    this.imeiListMap[detalleId] = [...current, ...next];
    this.imeiInputMap[detalleId] = '';
  }

  removeImei(detalleId: number, imei: string) {
    if (this.imeiDeletingMap[imei]) return;
    this.imeiDeletingMap[imei] = true;

    this.imeisService.eliminarImei(imei).subscribe({
      next: () => {
        const list = this.getImeis(detalleId).filter((i) => i !== imei);
        this.imeiListMap[detalleId] = list;
        this.imeiDeletingMap[imei] = false;
      },
      error: () => {
        this.imeiDeletingMap[imei] = false;
        this.imeiErrorMap[detalleId] = 'No se pudo eliminar el IMEI.';
      },
    });
  }

  guardarImeis(item: any) {
    const compraId = this.compra()?.id ?? this.compra()?.idCompra;
    const detalleId = this.getDetalleId(item);
    const productoId = this.getProductoId(item);
    const imeis = this.getImeis(detalleId);

    if (!compraId || !detalleId) {
      this.imeiErrorMap[detalleId] = 'No se pudo determinar la compra/detalle.';
      return;
    }

    if (!imeis.length) {
      this.imeiErrorMap[detalleId] = 'Ingrese al menos un IMEI.';
      return;
    }

    this.imeiSavingMap[detalleId] = true;

    this.imeisService
      .registrarImeis({ idCompra: compraId, idDetalle: detalleId, idProducto: productoId, imeis })
      .subscribe({
        next: () => {
          this.imeiSavingMap[detalleId] = false;
        },
        error: () => {
          this.imeiSavingMap[detalleId] = false;
          this.imeiErrorMap[detalleId] = 'Error al guardar IMEIs.';
        },
      });
  }
}