import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InventarioService } from '../../../../core/services/inventario/inventario.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { Inventario } from '../../../../core/models/almacen/invetario';
import { Router } from '@angular/router';
import { ClientesService } from '../../../../core/services/clientes/clientes.service';
import { Clientes } from '../../../../core/models/ventas/clientes';
import { PedidosService } from '../../../../core/services/pedidos/pedidos.service';
import { EstadosService } from '../../../../core/services/estados/estados.service';
import { Estado } from '../../../../core/models/ventas/Estado';
import { TipopagoService } from '../../../../core/services/tipopago/tipopago.service';
import { Tipopago } from '../../../../core/models/ventas/Tipospago';
import { MatIconModule } from '@angular/material/icon';
import { EditarClienteComponent } from '../../clientes/editar-cliente/editar-cliente.component';
import { MatDialog } from '@angular/material/dialog';
import { Cotizacion } from '../../../../core/models/ventas/cotizaciones';
import { CotizacionesService } from '../../../../core/services/cotizaciones/cotizaciones.service';
interface CartItem {
  productoDetalle: Inventario;
  cantidad: number;
  precio: number;
}

@Component({
  selector: 'app-nueva-cotizacion',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './nueva-cotizacion.component.html',
  styleUrl: './nueva-cotizacion.component.css',
})
export class NuevaCotizacionComponent {
  private inventarioService = inject(InventarioService);
  private clienteService = inject(ClientesService);
  private pedidosService = inject(CotizacionesService);
  private estadosService = inject(EstadosService);
  private tipopagoService = inject(TipopagoService);

  isEdit = signal(false);
  editingId = signal<number | null>(null);

  private router = inject(Router);
  page = signal(1);
  pageSize = signal(10);
  pageSizes = [10, 20, 30];

  productos = toSignal(this.inventarioService.listaProductos().pipe(map(res => (res as any).data as Inventario[])), { initialValue: [] });
  tiposPagoDisponibles = toSignal(this.tipopagoService.listarTiposPago().pipe(map(res => (res as any).data as Tipopago[])), { initialValue: [] });

  clienteList = toSignal(this.clienteService.listarClientes().pipe(map(res => (res as any).data as Clientes[])), { initialValue: [] });
  estadosList = toSignal(this.estadosService.listarEstados('PEDIDOS').pipe(map(res => (res as any).data as Estado[])), { initialValue: [] });
  selectedProvider = signal<Clientes | null>(null);
  search = signal('');
  serie = signal('');
  selectEstado = signal(2);
  searchProvedor = signal('');
  selCat = signal('Todos');
  cart = signal<CartItem[]>([]);
  saleDate = signal(new Date().toISOString().slice(0, 16));
  note = signal('');
  pagos = signal<{ tipo: Tipopago | null; monto: number }[]>([]);
  sendTicket = signal(false);

  constructor(private dialog: MatDialog) {
    effect(() => {
      this.search();
      this.selCat();
      this.page.set(1);
      this.clienteList();
      /*const lista = this.tiposPagoDisponibles();
      if (lista.length && this.pagos().length === 0) {
        // agrega la primera fila con el primer tipo disponible
        this.pagos.set([{ tipo: lista[0], monto: 0 }]);
      }*/
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
    return this.clienteList().filter(p => p && typeof p.clienteNombre === 'string' && p.clienteNombre.toLowerCase().includes(txt));
  });

  total = computed(() => this.cart().reduce((s, c) => s + c.precio * c.cantidad, 0));

  selectCat = (cat: string) => this.selCat.set(cat);
  updateSearch = (txt: string) => this.search.set(txt);
  updateSearchProvedor = (txt: string) => this.searchProvedor.set(txt);

  addToCart = (prod: Inventario) => {
    const list = [...this.cart()];
    const i = list.findIndex(c => c.productoDetalle.id === prod.id);
    i > -1 ? list[i].cantidad++ : list.push({ productoDetalle: prod, cantidad: 1, precio: prod.statusoff ? prod.preciooferta ?? 0 : prod.precioventa ?? 0 });
    this.cart.set(list);
  };
  touchCart() {
    this.cart.set([...this.cart()]);
  }
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
  compareTipo = (a: Tipopago | null, b: Tipopago | null) => (a && b ? a.id === b.id : a === b);
  private cargarCompra(id: number) {
    this.pedidosService.obtenerPedidoPorId(id).subscribe((comp: any) => {
      const pedido = comp.data;
      // Llena el formulario:
      this.selectedProvider.set(pedido.cliente);
      this.cart.set(pedido.pedidosDetalle);
      this.saleDate.set(pedido.fechaEntrega);
      this.note.set(pedido.observacion);
      this.sendTicket.set(pedido.sendTicket);
      this.serie.set(pedido.serie);
      this.pagos.set(pedido.pagosPedido);
      this.selectEstado.set(pedido.estado.id);
    });
  }

  pay = () => {
    if (!this.cart().length) return;

    if (!this.selectedProvider()) {
      alert('Debe seleccionar un cliente.');
      return;
    }

    const data = {
      id: this.editingId(),
      pedidosDetalle: this.cart(),
      total: this.total(),
      fechaEntrega: this.saleDate(),
      observacion: this.note(),
      sendTicket: this.sendTicket(),
      cliente: this.selectedProvider(),
      estado: this.selectEstado(),
      serie: this.serie(),
      origen: 'Interno',
      pagosPedido: this.pagos(),
    };
    console.log(data);

    if (!this.editingId()) {
      this.pedidosService.registrarPedido(data).subscribe({
        next: () => {
          console.log('Compra registrada exitosamente');
          this.clearAll();
        },
        error: err => {
          console.error('Error al registrar la compra:', err);
        },
      });
    } else {
      this.pedidosService.editarPedido(this.editingId(), data).subscribe({
        next: () => {
          console.log('Compra editada exitosamente');
          this.clearAll();
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
    return this.clienteList()
      .filter(p => p.clienteNombre?.toLowerCase().includes(term) || p.clienteNumerodocumento?.toLowerCase().includes(term))
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

  selectProvider(p: Clientes) {
    this.selectedProvider.set(p);
    this.clienteService.listarClientes().subscribe({
      next: () => {
        console.log('Cliente actualizado:', p);
      },
      error: err => {
        console.error('Error al actualizar el Cliente:', err);
      },
    });
    this.clienteList();
    this.searchProvedor.set('');
  }

  clearProvider() {
    this.selectedProvider.set(null);
  }

  addPago() {
    this.pagos.update(pagos => [...pagos, { tipo: null as any as Tipopago, monto: 0 }]);
  }

  removePago(index: number) {
    this.pagos.update(pagos => pagos.filter((_, i) => i !== index));
  }

  get sumaPagos() {
    return this.pagos().reduce((sum, p: { tipo: Tipopago | null; monto: number }) => sum + Number(p.monto), 0);
  }
  clearAll() {
    this.cart.set([]);
    this.selectedProvider.set(null);
    this.search.set('');
    this.searchProvedor.set('');
    this.selCat.set('Todos');
    this.page.set(1);
    this.serie.set('');
    this.selectEstado.set(1); // estado por defecto
    this.saleDate.set(new Date().toISOString().slice(0, 16));
    this.note.set('');
    this.sendTicket.set(false);
    // reinicia pagos: una fila con el primer tipo disponible o vacío
    //const firstTipo = this.tiposPagoDisponibles()[0] ?? null;
    // this.pagos.set([{ tipo: firstTipo, monto: 0 }]);
    this.pagos.set([]);
    // si estabas editando, sal del modo edición
    this.isEdit.set(false);
    this.editingId.set(null);
  }

  agregarCliente(): void {
    const dialogRef = this.dialog.open(EditarClienteComponent, {
      width: '55rem', // coincide con max-w-3xl
      maxWidth: '95vw',
      data: {
        title: 'Crear Cliente ',
        boton: 'Guardar',
      },
    });

    dialogRef.afterClosed().subscribe((resultado: any) => {
      if (resultado) {
        this.clienteService.optenerClientePorId(resultado.data.id).subscribe({
          next: (response: any) => {
            const resultado = response.data;
            this.selectProvider(resultado);
            console.log('Cliente creado:', resultado);
          },
          error: err => {
            console.error('Error al obtener el cliente:', err);
          },
        });
      }
    });
  }
}
