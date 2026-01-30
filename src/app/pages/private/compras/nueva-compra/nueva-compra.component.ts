import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InventarioService } from '../../../../core/services/inventario/inventario.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { Inventario } from '../../../../core/models/almacen/invetario';
import { ProvedoresService } from '../../../../core/services/provedores/provedores.service';
import { Proveedor } from '../../../../core/models/compras/provedor';
import { ComprasService } from '../../../../core/services/compras/compras.service';
import { Router } from '@angular/router';
interface CartItem {
  productoDetalle: Inventario;
  cantidad: number;
  precio: number;
}

@Component({
  selector: 'app-nueva-compra',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './nueva-compra.component.html',
  styleUrls: ['./nueva-compra.component.css'],
})
export class NuevaCompraComponent {
  private inventarioService = inject(InventarioService);
  private provedoresService = inject(ProvedoresService);
  private comprasService = inject(ComprasService);
  isEdit = signal(false);
  editingId = signal<number | null>(null);

  private router = inject(Router);
  page = signal(1);
  pageSize = signal(10);
  pageSizes = [10, 20, 30];

  productos = toSignal(this.inventarioService.listaProductos().pipe(map(res => (res as any).data as Inventario[])), { initialValue: [] });

  providerList = toSignal(this.provedoresService.listarProvedores().pipe(map(res => (res as any).data as Proveedor[])), { initialValue: [] });

  selectedProvider = signal<Proveedor | null>(null);
  search = signal('');
  serie = signal('');
  searchProvedor = signal('');
  selCat = signal('Todos');
  cart = signal<CartItem[]>([]);
  saleDate = signal(new Date().toISOString().slice(0, 16));
  note = signal('');
  sendTicket = signal(false);

  constructor() {
    effect(() => {
      this.search();
      this.selCat();
      this.page.set(1);
      this.providerList();
    });

    const nav = this.router.getCurrentNavigation();
    const compraId = nav?.extras.state?.['compraId'] as number | undefined;

    if (compraId) {
      this.isEdit.set(true);
      this.editingId.set(compraId);
      console.log('Editing purchase with ID:', compraId);
      this.cargarCompra(compraId);
    }
  }

  pageCount = computed(() => Math.max(1, Math.ceil(this.filtered().length / this.pageSize())));

  paged = computed(() => {
    const start = (this.page() - 1) * this.pageSize();
    return this.filtered().slice(start, start + this.pageSize());
  });

  categories = computed(() => {
    const set = new Set<string>();
    this.productos().forEach(p => p?.marca && set.add(p.marca));
    return ['Todos', ...Array.from(set).sort()];
  });

  filtered = computed(() => {
    const txt = this.search().toLowerCase().trim();
    const cat = this.selCat();
    return this.productos().filter(p => p && typeof p.nombreProducto === 'string' && (cat === 'Todos' || p.marca === cat) && p.nombreProducto.toLowerCase().includes(txt));
  });

  filteredProvedores = computed(() => {
    const txt = this.searchProvedor().toLowerCase().trim();
    return this.providerList().filter(p => p && typeof p.nombre === 'string' && p.nombre.toLowerCase().includes(txt));
  });

  total = computed(() => this.cart().reduce((s, c) => s + c.precio * c.cantidad, 0));
  touchCart() {
    this.cart.set([...this.cart()]);
  }
  selectCat = (cat: string) => this.selCat.set(cat);
  updateSearch = (txt: string) => this.search.set(txt);
  updateSearchProvedor = (txt: string) => this.searchProvedor.set(txt);

  addToCart = (prod: Inventario) => {
    const list = [...this.cart()];
    const i = list.findIndex(c => c.productoDetalle.id === prod.id);
    i > -1 ? list[i].cantidad++ : list.push({ productoDetalle: prod, cantidad: 1, precio: prod.preciocompra });
    this.cart.set(list);
  };

  inc = (item: CartItem) => {
    if (item.cantidad < item.productoDetalle.cantidad) {
      item.cantidad++;
      this.cart.set([...this.cart()]);
    }
  };

  dec = (item: CartItem) => {
    if (item.cantidad > 1) {
      item.cantidad--;
      this.cart.set([...this.cart()]);
    }
  };

  remove = (item: CartItem) => this.cart.set(this.cart().filter(c => c !== item));
  private cargarCompra(id: number) {
    this.comprasService.obtenerCompraPorId(id).subscribe((comp: any) => {
      const pedido = comp.data;
      // Llena el formulario:
      this.selectedProvider.set(pedido.provedor);
      this.cart.set(pedido.comprasDetalle ?? []);
      this.saleDate.set(pedido.fecha);
      this.note.set(pedido.observacion);
      this.sendTicket.set(pedido.sendTicket);
      this.serie.set(pedido.serie);
    });
  }
  pay = () => {
    if (!this.cart().length) return;
    const data = {
      id: this.editingId(),
      comprasDetalle: this.cart(),
      total: this.total(),
      fecha: this.saleDate(),
      observacion: this.note(),
      sendTicket: this.sendTicket(),
      provedor: this.selectedProvider(),
      serie: this.serie(),
    };
    console.log(data);
    if (!this.editingId()) {
      this.comprasService.registrarCompra(data).subscribe({
        next: () => {
          console.log('Compra registrada exitosamente');
          this.cart.set([]);
        },
        error: err => {
          console.error('Error al registrar la compra:', err);
        },
      });
    } else {
      this.comprasService.editarCompra(this.editingId(), data).subscribe({
        next: () => {
          console.log('Compra editada exitosamente');
          this.cart.set([]);
        },
        error: err => {
          console.error('Error al editar la compra:', err);
        },
      });
    }
  };

  categoryCount = (cat: string) => (cat === 'Todos' ? this.productos().length : this.productos().filter(p => p.marca === cat).length);

  catCounts = computed(() => {
    const counts: Record<string, number> = { Todos: this.productos().length };
    for (const p of this.productos()) {
      if (p.marca != null) {
        counts[p.marca] = (counts[p.marca] ?? 0) + 1;
      }
    }
    return counts;
  });

  suggestions = computed(() => {
    const term = this.search().toLowerCase().trim();
    if (!term) return [];
    return this.productos()
      .filter(p => p.nombreProducto?.toLowerCase().includes(term))
      .slice(0, 10);
  });

  suggestionsProvedor = computed(() => {
    const term = this.searchProvedor().toLowerCase().trim();
    if (!term) return [];
    return this.providerList()
      .filter(p => p.nombre?.toLowerCase().includes(term) || p.numerodocumento?.toLowerCase().includes(term))
      .slice(0, 10);
  });

  showSuggestions = computed(() => this.search().trim() !== '' && this.suggestions().length > 0);

  selectSuggestion = (prod: Inventario) => {
    this.addToCart(prod);
    this.search.set('');
  };

  next = () => this.page.set(Math.min(this.page() + 1, this.pageCount()));
  prev = () => this.page.set(Math.max(this.page() - 1, 1));
  go = (n: number) => this.page.set(Math.min(Math.max(n, 1), this.pageCount()));
  changePageSize = (sz: number) => {
    this.pageSize.set(sz);
    this.go(1);
  };

  selectProvider(p: Proveedor) {
    this.selectedProvider.set(p);
    this.provedoresService.listarProvedores().subscribe({
      next: () => {
        console.log('Proveedor actualizado:', p);
      },
      error: err => {
        console.error('Error al actualizar el proveedor:', err);
      },
    });
    this.providerList();
    this.searchProvedor.set('');
  }

  clearProvider() {
    this.selectedProvider.set(null);
  }
}
