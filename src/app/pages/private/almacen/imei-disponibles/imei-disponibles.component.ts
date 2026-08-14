import { CommonModule } from "@angular/common";
import { Component, computed, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { InventarioService } from "../../../../core/services/inventario/inventario.service";
import { ImeisService } from "../../../../core/services/imeis/imeis.service";

@Component({
  selector: "app-imei-disponibles",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./imei-disponibles.component.html",
  styleUrl: "./imei-disponibles.component.css",
})
export class ImeiDisponiblesComponent {
  private inventarioService = inject(InventarioService);
  private imeisService = inject(ImeisService);

  productos = signal<any[]>([]);
  selectedProductoId = signal<number | null>(null);
  search = signal("");
  loading = signal(false);
  error = signal<string | null>(null);
  pageIndex = signal(0);
  pageSize = signal(5);
  total = signal(0);
  pageSizes = [5, 10, 20, 30, 50, 100, 1000];
  totalPagesValue = signal(0);
  totalPages = computed(() => {
    const fromApi = this.totalPagesValue();
    if (fromApi > 0) return fromApi;
    const size = Math.max(1, this.pageSize());
    return Math.max(1, Math.ceil(this.total() / size));
  });

  imeisMap: Record<number, string[]> = {};
  imeiLoadingMap: Record<number, boolean> = {};
  imeiErrorMap: Record<number, string> = {};

  filteredProductos = computed(() => {
    return this.productos();
  });

  ngOnInit(): void {
    this.cargarProductos();
  }

  buscar(): void {
    this.pageIndex.set(0);
    this.cargarProductos();
  }

  private cargarProductos(): void {
    this.loading.set(true);
    this.error.set(null);
    const maxPages = this.totalPagesValue();
    if (maxPages > 0 && this.pageIndex() >= maxPages) {
      this.pageIndex.set(Math.max(0, maxPages - 1));
    }
    const term = this.search().trim();
    const payload: any = {
      pagina: this.pageIndex(), // backend 0-based
      tamanio: this.pageSize(),
    };
    if (term.length >= 3) {
      payload.datos = { buscador: term };
    }

    this.inventarioService.listaProductosDisponiblesPaginado(payload).subscribe({
      next: (res: any) => {
        const root = res?.data ?? res ?? {};
        const data =
          root?.data && (root?.data?.lista || root?.data?.totalRegistros || root?.data?.totalPaginas)
            ? root.data
            : root;
        const list = data?.lista ?? data?.content ?? data?.items ?? [];
        this.productos.set(Array.isArray(list) ? list : []);
        const total = Number(data?.totalRegistros ?? data?.totalElements ?? list?.length ?? 0);
        this.total.set(total);

        const paginaActual = Number(data?.paginaActual ?? data?.number ?? this.pageIndex());
        this.pageIndex.set(Math.max(0, paginaActual));

        const totalPaginas = Number(data?.totalPaginas ?? data?.totalPages ?? 0);
        this.totalPagesValue.set(totalPaginas > 0 ? totalPaginas : 0);
        if (totalPaginas > 0 && this.pageIndex() >= totalPaginas) {
          this.pageIndex.set(Math.max(0, totalPaginas - 1));
        }
        this.loading.set(false);
        this.selectFirst();
      },
      error: () => {
        this.loading.set(false);
        this.error.set("No se pudo cargar el inventario.");
      },
    });
  }

  selectItem(item: any): void {
    const id = this.getProductoId(item);
    if (!id) return;
    this.selectedProductoId.set(id);
    this.cargarImeis(item);
  }

  selectedItem(): any | null {
    const id = this.selectedProductoId();
    if (!id) return null;
    return this.productos().find((p) => this.getProductoId(p) === id) ?? null;
  }

  private selectFirst(): void {
    const list = this.filteredProductos();
    if (!list.length) return;
    this.selectItem(list[0]);
  }

  getProductoId(item: any): number {
    return item?.idProducto ?? item?.productoId ?? item?.id ?? 0;
  }

  imeisCount(item: any): number {
    const id = this.getProductoId(item);
    return (this.imeisMap[id] ?? []).length;
  }

  private cargarImeis(item: any): void {
    const idProducto = this.getProductoId(item);
    if (!idProducto) return;
    if (this.imeisMap[idProducto]) return;
    if (this.imeiLoadingMap[idProducto]) return;

    this.imeiLoadingMap[idProducto] = true;
    this.imeiErrorMap[idProducto] = "";

    this.imeisService.listarDisponiblesPorProducto(idProducto).subscribe({
      next: (res: any) => {
        const data = res?.data ?? res ?? [];
        const list = Array.isArray(data) ? data.map((x) => String(x?.imei ?? x)) : [];
        this.imeisMap[idProducto] = list;
        this.imeiLoadingMap[idProducto] = false;
      },
      error: () => {
        this.imeiLoadingMap[idProducto] = false;
        this.imeiErrorMap[idProducto] = "No se pudieron cargar los IMEIs.";
      },
    });
  }

  prevPage() {
    if (this.pageIndex() <= 0) return;
    this.pageIndex.set(this.pageIndex() - 1);
    this.cargarProductos();
  }

  nextPage() {
    const maxPages = this.totalPagesValue() > 0 ? this.totalPagesValue() : this.totalPages();
    if (this.pageIndex() + 1 >= maxPages) return;
    this.pageIndex.set(this.pageIndex() + 1);
    this.cargarProductos();
  }

  changePageSize(size: number) {
    const next = Number(size);
    if (!Number.isFinite(next) || next <= 0) return;
    this.pageSize.set(next);
    this.pageIndex.set(0);
    this.cargarProductos();
  }
}