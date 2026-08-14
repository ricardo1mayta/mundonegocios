import { CommonModule } from "@angular/common";
import { Component, effect, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { PedidosService } from "../../../../core/services/pedidos/pedidos.service";
import { ImeisService } from "../../../../core/services/imeis/imeis.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-registro-imeis-venta",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./registro-imeis-venta.component.html",
  styleUrl: "./registro-imeis-venta.component.css",
})
export class RegistroImeisVentaComponent {
  private pedidosService = inject(PedidosService);
  private imeisService = inject(ImeisService);
  private route = inject(ActivatedRoute);

  pedido = signal<any>(null);
  selectedDetalleId = signal<number | null>(null);

  imeiInputMap: Record<number, string> = {};
  imeiErrorMap: Record<number, string> = {};
  imeiSavingMap: Record<number, boolean> = {};
  imeiDeletingMap: Record<string, boolean> = {};
  imeiListMap: Record<number, string[]> = {};
  imeiSavedMap: Record<number, string[]> = {};
  disponiblesMap: Record<number, string[]> = {};
  despachadosMap: Record<number, string[]> = {};
  despachadosLoadingMap: Record<number, boolean> = {};
  despachadosErrorMap: Record<number, string> = {};
  despachadosDeletingMap: Record<string, boolean> = {};

  constructor() {
    effect(() => {
      const ventaId = Number(this.route.snapshot.paramMap.get("id"));
      if (ventaId) {
        this.cargarVenta(ventaId);
      }
    });
  }

  private cargarVenta(id: number) {
    this.pedidosService.obtenerPedidoPorId(id).subscribe((resp: any) => {
      this.pedido.set(resp.data ?? resp);
      this.cargarImeisVenta(id);
      this.selectFirstPending();
    });
  }

  private cargarImeisVenta(idVenta: number) {
    this.imeisService.listarPorVenta(idVenta).subscribe({
      next: (res: any) => {
        this.imeiListMap = this.normalizeImeiResponse(res);
        this.imeiSavedMap = Object.fromEntries(Object.entries(this.imeiListMap).map(([k, v]) => [Number(k), [...v]]));
        this.selectFirstPending();
      },
      error: () => {
        // sin bloqueo
      },
    });
  }

  private normalizeImeiResponse(res: any): Record<number, string[]> {
    const map: Record<number, string[]> = {};
    const data = res?.data ?? res ?? [];
    if (Array.isArray(data)) {
      for (const row of data) {
        const detalleId = row?.idDetalle ?? row?.idPedidoDetalle ?? row?.detalleId ?? row?.id_detalle;
        const imei = row?.imei ?? row?.codigo ?? row;
        if (!detalleId || !imei) continue;
        const key = Number(detalleId);
        map[key] = map[key] ?? [];
        map[key].push(String(imei));
      }
      return map;
    }
    if (data && typeof data === "object") {
      for (const [k, v] of Object.entries(data)) {
        if (Array.isArray(v)) {
          map[Number(k)] = v.map(String);
        }
      }
      return map;
    }
    return map;
  }

  productos() {
    return this.pedido()?.pedidosDetalle ?? [];
  }

  getDetalleId(item: any): number {
    return item?.id ?? item?.id ?? 0;
  }

  getProductoId(item: any): number {
    return item?.productoDetalle?.id ?? item?.idProducto ?? 0;
  }

  getClienteId(): number {
    return this.pedido()?.idCliente ?? this.pedido()?.cliente?.id ?? 0;
  }

  imeisCount(item: any): number {
    const id = this.getDetalleId(item);
    return (this.imeiListMap[id] ?? []).length;
  }

  selectItem(item: any) {
    const id = this.getDetalleId(item);
    if (!id) return;
    this.selectedDetalleId.set(id);
    this.cargarDisponibles(item);
    this.cargarDespachados(item);
  }

  selectedItem() {
    const id = this.selectedDetalleId();
    if (!id) return null;
    return this.productos().find((i: any) => this.getDetalleId(i) === id) ?? null;
  }

  private selectFirstPending() {
    const items = this.productos();
    if (!items.length) return;
    const pending = items.find((i: any) => this.imeisCount(i) < (i?.cantidad ?? 0));
    const chosen = pending ?? items[0];
    const id = this.getDetalleId(chosen);
    this.selectedDetalleId.set(id);
    this.cargarDisponibles(chosen);
    this.cargarDespachados(chosen);
  }

  private cargarDisponibles(item: any) {
    const detalleId = this.getDetalleId(item);
    if (this.disponiblesMap[detalleId]) return;
    const idProducto = this.getProductoId(item);
    if (!idProducto) return;

    this.imeisService.listarDisponiblesPorProducto(idProducto).subscribe({
      next: (res: any) => {
        const data = res?.data ?? res ?? [];
        const list = Array.isArray(data) ? data.map((x) => String(x?.imei ?? x)) : [];
        this.disponiblesMap[detalleId] = list;
      },
      error: () => {
        this.disponiblesMap[detalleId] = [];
      },
    });
  }

  private cargarDespachados(item: any) {
    const detalleId = this.getDetalleId(item);
    if (!detalleId) return;
    if (this.despachadosMap[detalleId]) return;
    if (this.despachadosLoadingMap[detalleId]) return;

    this.despachadosLoadingMap[detalleId] = true;
    this.despachadosErrorMap[detalleId] = "";

    this.imeisService.listarDespachadosPorDetalle(detalleId).subscribe({
      next: (res: any) => {
        const data = res?.data ?? res ?? [];
        const list = Array.isArray(data) ? data.map((x) => String(x?.imei ?? x)) : [];
        this.despachadosMap[detalleId] = list;
        this.despachadosLoadingMap[detalleId] = false;
      },
      error: () => {
        this.despachadosLoadingMap[detalleId] = false;
        this.despachadosErrorMap[detalleId] = "No se pudieron cargar los IMEIs despachados.";
      },
    });
  }

  removeImeiDespachado(detalleId: number, imei: string) {
    if (!detalleId || !imei) return;
    if (this.despachadosDeletingMap[imei]) return;
    Swal.fire({
      title: "Â¿Eliminar IMEI despachado?",
      text: `Se quitará el IMEI ${imei} del despacho.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (!result.isConfirmed) return;
      this.despachadosDeletingMap[imei] = true;

      this.imeisService.eliminarImeiDespachado(detalleId, imei).subscribe({
        next: () => {
          this.despachadosMap[detalleId] = (this.despachadosMap[detalleId] ?? []).filter((i) => i !== imei);
          this.despachadosDeletingMap[imei] = false;
        },
        error: () => {
          this.despachadosDeletingMap[imei] = false;
          this.despachadosErrorMap[detalleId] = "No se pudo eliminar el IMEI despachado.";
        },
      });
    });
  }

  addImei(item: any) {
    const detalleId = this.getDetalleId(item);
    const max = Number(item?.cantidad ?? 0);
    const raw = (this.imeiInputMap[detalleId] ?? "").trim();
    this.imeiErrorMap[detalleId] = "";
    if (!raw) return;

    if (!/^\d{14,17}$/.test(raw)) {
      this.imeiErrorMap[detalleId] = "IMEI invalido.";
      return;
    }

    const current = new Set(this.imeiListMap[detalleId] ?? []);
    if (current.has(raw)) {
      this.imeiErrorMap[detalleId] = "IMEI ya agregado.";
      return;
    }

    const disponibles = new Set(this.disponiblesMap[detalleId] ?? []);
    if (disponibles.size && !disponibles.has(raw)) {
      this.imeiErrorMap[detalleId] = "IMEI no disponible para venta.";
      return;
    }

    if (max > 0 && current.size + 1 > max) {
      this.imeiErrorMap[detalleId] = "Se excede la cantidad del producto.";
      return;
    }

    this.imeiListMap[detalleId] = [...current, raw];
    this.imeiInputMap[detalleId] = "";
  }

  guardarImeis(item: any) {
    const idVenta = this.pedido()?.id ?? this.pedido()?.idPedido;
    const idDetalle = this.getDetalleId(item);
    const idCliente = this.getClienteId();
    const imeis = this.imeiListMap[idDetalle] ?? [];

    if (!idVenta || !idDetalle || !idCliente) {
      this.imeiErrorMap[idDetalle] = "Faltan datos de venta/cliente.";
      return;
    }
    if (!imeis.length) {
      this.imeiErrorMap[idDetalle] = "Ingrese al menos un IMEI.";
      return;
    }

    this.imeiSavingMap[idDetalle] = true;
    this.imeisService.asignarImeisVenta({ idVenta, idDetalle, idCliente, imeis }).subscribe({
      next: () => {
        this.imeiSavingMap[idDetalle] = false;
        this.imeiSavedMap[idDetalle] = [...imeis];
      },
      error: () => {
        this.imeiSavingMap[idDetalle] = false;
        this.imeiErrorMap[idDetalle] = "Error al asignar IMEIs.";
      },
    });
  }

  removeImei(detalleId: number, imei: string) {
    const saved = new Set(this.imeiSavedMap[detalleId] ?? []);
    if (!saved.has(imei)) {
      this.imeiListMap[detalleId] = (this.imeiListMap[detalleId] ?? []).filter((i) => i !== imei);
      return;
    }

    if (this.imeiDeletingMap[imei]) return;
    this.imeiDeletingMap[imei] = true;

    this.imeisService.eliminarImeiVenta(imei).subscribe({
      next: () => {
        this.imeiListMap[detalleId] = (this.imeiListMap[detalleId] ?? []).filter((i) => i !== imei);
        this.imeiSavedMap[detalleId] = (this.imeiSavedMap[detalleId] ?? []).filter((i) => i !== imei);
        this.imeiDeletingMap[imei] = false;
      },
      error: () => {
        this.imeiDeletingMap[imei] = false;
        this.imeiErrorMap[detalleId] = "No se pudo desasignar el IMEI.";
      },
    });
  }
}
