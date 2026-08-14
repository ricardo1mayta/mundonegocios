import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Clientes } from '../../../../core/models/ventas/clientes';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { NgxEditorModule } from 'ngx-editor';
import { MaterialModule } from '../../../../core/modules/material/material.module';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { ClientesService } from '../../../../core/services/clientes/clientes.service';
import { EditarClienteComponent } from '../../clientes/editar-cliente/editar-cliente.component';
import { MatDialog } from '@angular/material/dialog';
import { UbigeoService } from '../../../../core/services/ubigeo/ubigeo.service';
import { CodigosService } from '../../../../core/services/codigos/codigos.service';
import { Router } from '@angular/router';
import { PedidosService } from '../../../../core/services/pedidos/pedidos.service';
import { ImeisService } from '../../../../core/services/imeis/imeis.service';
import { AuthService, MeResponse } from '../../../../core/services/auth.service';
import { GuiaremisionService } from '../../../../core/services/guiremision/guiaremision.service';
import { PrimeNgModule } from 'src/app/core/modules/primeng/primeng.module';
//import { GuiaRemisionRequest } from './models';

@Component({
  selector: 'app-nueva-guiaremision',
  imports: [PrimeNgModule, CommonModule, FormsModule, MatIconModule, ReactiveFormsModule, MatStepperModule, MatSelectModule, NgxEditorModule, MaterialModule],
  templateUrl: './nueva-guiaremision.component.html',
  styleUrl: './nueva-guiaremision.component.css',
})
export class NuevaGuiaremisionComponent {
  step1!: FormGroup; // DATOS
  step2!: FormGroup; // ENVÍO
  step3!: FormGroup; // TRANSPORTISTA
  private clienteService = inject(ClientesService);
  detalleArr!: FormArray;
  searchProvedor = signal('');
  selectedProvider = signal<Clientes | null>(null);
  searchTercero = signal('');
  selectedTercero = signal<Clientes | null>(null);
  clienteList = toSignal(this.clienteService.listarClientes().pipe(map(res => (res as any).data as Clientes[])), { initialValue: [] });
  tiposDocumento = signal<any[]>([]);
  private codigos = inject(CodigosService);
  private ubigeoService = inject(UbigeoService);
  private router = inject(Router);
  private pedidosService = inject(PedidosService);
  private imeisService = inject(ImeisService);
  private auth = inject(AuthService);
  private guiaService = inject(GuiaremisionService);

  isEdit = signal(false);
  editingId = signal<number | null>(null);

  private readonly tipoDoc = '09';
  private readonly serie = 'T001';

  despachadosMap: Record<number, string[]> = {};
  despachadosLoadingMap: Record<number, boolean> = {};
  despachadosErrorMap: Record<number, string> = {};

  constructor(private fb: FormBuilder, private dialog: MatDialog) {
    /* ===== PASO 1 – Datos ===== */
    this.step1 = this.fb.group({
      fechaEmision: [new Date(), Validators.required],
      clienteDestinoId: [null],
      clienteTerceroId: [],
      observacion: [''],
    });

    /* ===== PASO 2 – Envío ===== */
    this.step2 = this.fb.group({
      envioCodTraslado: ['01', Validators.required],
      envioDesTraslado: ['VENTA', Validators.required],
      envioModTraslado: ['01', Validators.required],
      envioFecTraslado: [new Date(), Validators.required],
      envioCodPuerto: [''],
      envioIndTransbordo: [false],
      envioPesoTotal: [],
      envioUndPesoTotal: ['KGM'],
      envioNumContenedor: [''],
      envioLlegadaUbigueo: [''],
      envioLlegadaDireccion: [''],
      envioPartidaUbigueo: [''],
      envioPartidaDireccion: [''],
      clienteDepartamento: [null, Validators.required],
      clienteProvincia: [null, Validators.required],
      clienteDistrito: [null, Validators.required],
      terceroDepartamento: [null, Validators.required],
      terceroProvincia: [null, Validators.required],
      terceroDistrito: [null, Validators.required],
    });

    /* ===== PASO 3 – Transportista ===== */
    this.step3 = this.fb.group({
      envioTransportistaTipoDoc: [],
      envioTransportistaNumDoc: [],
      envioTransportistaRznSocial: [],
      envioTransportistaPlaca: [],
      envioTransportistaChoferTipoDoc: [],
      envioTransportistaChoferDoc: [],
    });

    /* ===== PASO 4 – Detalle (FormArray) ===== */
    this.detalleArr = this.fb.array([]);
    this.clienteList();
    this.codigos.listarTiposCodigo(1).subscribe((r: any) => this.tiposDocumento.set(r.data ?? r));
    this.ubigeoService.listarDepartamentos().subscribe((r: any) => {
      this.departamentos.set(r.data ?? r);
      this.departamentosTercero.set(r.data ?? r);
    });

    /* cascading ubigeo cliente */
    this.step2.get('clienteDepartamento')!.valueChanges.subscribe(dep => {
      if (dep) {
        this.ubigeoService.listarProvincias(dep).subscribe((p: any) => {
          this.provincias.set(p.data ?? p);
          this.distritos.set([]);
        });
      } else {
        this.provincias.set([]);
        this.distritos.set([]);
      }
    });

    this.step2.get('clienteProvincia')!.valueChanges.subscribe(prov => {
      const dep = this.step2.get('clienteDepartamento')!.value;
      if (dep && prov) {
        this.ubigeoService.listarDistritos(prov).subscribe((d: any) => this.distritos.set(d.data ?? d));
      } else this.distritos.set([]);
    });
    /* cascading ubigeo  tercero */
    this.step2.get('terceroDepartamento')!.valueChanges.subscribe(dep => {
      if (dep) {
        this.ubigeoService.listarProvincias(dep).subscribe((p: any) => {
          this.provinciasTercero.set(p.data ?? p);
          this.distritosTercero.set([]);
        });
      } else {
        this.provinciasTercero.set([]);
        this.distritosTercero.set([]);
      }
    });

    this.step2.get('terceroProvincia')!.valueChanges.subscribe(prov => {
      const dep = this.step2.get('terceroDepartamento')!.value;
      if (dep && prov) {
        this.ubigeoService.listarDistritos(prov).subscribe((d: any) => this.distritosTercero.set(d.data ?? d));
      } else this.distritosTercero.set([]);
    });

    effect(() => {
      const ctx = this.auth.ctx();
      if (ctx) this.setPartidaDesdeEmpresa(ctx);
    });
  }

  ngOnInit(): void {
    const nav = this.router.getCurrentNavigation();
    const pedidoId = nav?.extras?.state?.['pedidoId'] ?? (history.state && history.state['pedidoId']);
    if (pedidoId) {
      this.cargarDesdePedido(Number(pedidoId));
    }

    const guiaId = nav?.extras?.state?.['guiaId'] ?? nav?.extras?.state?.['compraId'] ?? (history.state && (history.state['guiaId'] ?? history.state['compraId']));
    if (guiaId) {
      this.isEdit.set(true);
      this.editingId.set(Number(guiaId));
      this.cargarGuia(Number(guiaId));
    }
  }

  /* ---------- helpers Detalle ---------- */
  get detalles() {
    return this.detalleArr;
  }
  get detalleControls() {
    return this.detalleArr.controls as FormGroup[];
  }
  addDetalle() {
    this.detalles.push(
      this.fb.group({
        detalleId: [null],
        productoId: [null, Validators.required],
        descripcion: ['', Validators.required],
        cantidad: [1, [Validators.required, Validators.min(0.01)]],
        unidadMedida: ['UND'],
        pesoUnitario: [0],
      })
    );
  }
  removeDetalle(i: number) {
    this.detalles.removeAt(i);
  }

  private cargarDesdePedido(pedidoId: number) {
    this.pedidosService.obtenerPedidoPorId(pedidoId).subscribe({
      next: (resp: any) => {
        const pedido = resp?.data ?? resp;
        const detalles = pedido?.pedidosDetalle ?? [];
        this.setClienteDesdePedido(pedido);
        this.setDetallesDesdePedido(detalles);
      },
      error: () => {},
    });
  }

  private cargarGuia(guiaId: number) {
    this.guiaService.obtenerPedidoPorId(guiaId).subscribe({
      next: (resp: any) => {
        const guia = resp?.data ?? resp;
        if (!guia) return;

        // Step 1
        if (guia?.clienteDestinoId) {
          this.step1.patchValue({ clienteDestinoId: guia.clienteDestinoId });
          this.clienteService.optenerClientePorId(guia.clienteDestinoId).subscribe({
            next: (r: any) => {
              const cliente = r?.data ?? r;
              if (cliente) {
                this.selectedProvider.set(cliente);
                this.searchProvedor.set(cliente?.clienteNombre ?? '');
                this.setUbigeoLlegadaDesdeCliente(cliente);
              }
            },
            error: () => {},
          });
        }
        if (guia?.observacion) {
          this.step1.patchValue({ observacion: guia.observacion });
        }

        // Step 2
        this.step2.patchValue({
          envioCodTraslado: guia?.envioCodTraslado ?? this.step2.get('envioCodTraslado')?.value,
          envioDesTraslado: guia?.envioDesTraslado ?? this.step2.get('envioDesTraslado')?.value,
          envioModTraslado: guia?.envioModTraslado ?? this.step2.get('envioModTraslado')?.value,
          envioFecTraslado: guia?.envioFecTraslado ? new Date(guia.envioFecTraslado) : this.step2.get('envioFecTraslado')?.value,
          envioCodPuerto: guia?.envioCodPuerto ?? '',
          envioIndTransbordo: guia?.envioIndTransbordo ?? false,
          envioPesoTotal: guia?.envioPesoTotal ?? null,
          envioUndPesoTotal: guia?.envioUndPesoTotal ?? 'KGM',
          envioNumContenedor: guia?.envioNumContenedor ?? '',
          envioLlegadaUbigueo: guia?.envioLlegadaUbigueo ?? '',
          envioLlegadaDireccion: guia?.envioLlegadaDireccion ?? '',
          envioPartidaUbigueo: guia?.envioPartidaUbigueo ?? '',
          envioPartidaDireccion: guia?.envioPartidaDireccion ?? '',
        });

        const llegadaUbigeo = guia?.envioLlegadaUbigeo ?? guia?.envioLlegadaUbigueo;
        const partidaUbigeo = guia?.envioPartidaUbigeo ?? guia?.envioPartidaUbigueo;
        if (llegadaUbigeo) {
          this.setUbigeoLlegadaDesdeCodigo(String(llegadaUbigeo));
        }
        if (partidaUbigeo) {
          this.setUbigeoPartidaDesdeCodigo(String(partidaUbigeo));
        }

        // Step 3
        this.step3.patchValue({
          envioTransportistaTipoDoc: guia?.envioTransportistaTipoDoc ?? null,
          envioTransportistaNumDoc: guia?.envioTransportistaNumDoc ?? null,
          envioTransportistaRznSocial: guia?.envioTransportistaRznSocial ?? null,
          envioTransportistaPlaca: guia?.envioTransportistaPlaca ?? null,
          envioTransportistaChoferTipoDoc: guia?.envioTransportistaChoferTipoDoc ?? null,
          envioTransportistaChoferDoc: guia?.envioTransportistaChoferDoc ?? null,
        });

        // Detalle
        const detalles = guia?.detalle ?? guia?.detalles ?? guia?.guiaDetalle ?? [];
        this.setDetallesDesdeGuia(detalles);
      },
      error: () => {},
    });
  }

  private setClienteDesdePedido(pedido: any) {
    const clienteObj = pedido?.cliente ?? pedido?.clienteDestino ?? pedido?.clienteData ?? null;
    const clienteId = clienteObj?.id ?? pedido?.idCliente ?? pedido?.clienteId ?? pedido?.clienteDestinoId ?? null;
    if (!clienteId && !clienteObj) return;

    if (clienteId) {
      this.step1.patchValue({ clienteDestinoId: clienteId });
    }

    if (clienteObj) {
      this.selectedProvider.set(clienteObj as Clientes);
      this.searchProvedor.set((clienteObj as Clientes)?.clienteNombre ?? '');
      this.setUbigeoLlegadaDesdeCliente(clienteObj as Clientes);
      return;
    }

    this.clienteService.optenerClientePorId(clienteId).subscribe({
      next: (response: any) => {
        const cliente = response?.data ?? response;
        if (cliente) {
          this.selectedProvider.set(cliente);
          this.searchProvedor.set(cliente?.clienteNombre ?? '');
          this.setUbigeoLlegadaDesdeCliente(cliente);
        }
      },
      error: () => {},
    });
  }

  private setDetallesDesdePedido(detalles: any[]) {
    while (this.detalles.length) {
      this.detalles.removeAt(0);
    }
    for (const item of detalles) {
      const detalleId = item?.id ?? item?.idDetalle ?? item?.idPedidoDetalle ?? null;
      const productoId = item?.idProducto ?? item?.productoDetalle?.id ?? null;
      const descripcion = item?.productoDetalle?.nombreProducto ?? item?.descripcion ?? '';
      const cantidad = Number(item?.cantidad ?? 1);
      this.detalles.push(
        this.fb.group({
          detalleId: [detalleId],
          productoId: [productoId, Validators.required],
          descripcion: [descripcion, Validators.required],
          cantidad: [cantidad, [Validators.required, Validators.min(0.01)]],
          unidadMedida: [item?.unidadMedida ?? 'UND'],
          pesoUnitario: [item?.pesoUnitario ?? 0],
        })
      );
      if (detalleId) {
        this.cargarDespachados(detalleId);
      }
    }
  }

  private cargarDespachados(detalleId: number) {
    if (this.despachadosMap[detalleId]) return;
    if (this.despachadosLoadingMap[detalleId]) return;
    this.despachadosLoadingMap[detalleId] = true;
    this.despachadosErrorMap[detalleId] = '';

    this.imeisService.listarDespachadosPorDetalle(detalleId).subscribe({
      next: (res: any) => {
        const data = res?.data ?? res ?? [];
        const list = Array.isArray(data) ? data.map((x) => String(x?.imei ?? x)) : [];
        this.despachadosMap[detalleId] = list;
        this.despachadosLoadingMap[detalleId] = false;
      },
      error: () => {
        this.despachadosLoadingMap[detalleId] = false;
        this.despachadosErrorMap[detalleId] = 'No se pudieron cargar los IMEIs despachados.';
      },
    });
  }

  /* ---------- submit ---------- */
  guardar() {
    if (this.step1.invalid || this.step2.invalid || this.step3.invalid) return;

    const payload = this.buildGuiaPayload();
    console.log('Guía de Remisión �?? ’', payload);

    const req$ = this.editingId() ? this.guiaService.editarGuiaRemision(this.editingId(), payload) : this.guiaService.registrarGuiaRemision(payload);
    req$.subscribe({
      next: (res: any) => {
        console.log(this.editingId() ? 'Guía actualizada exitosamente' : 'Guía registrada exitosamente');
        const status = res?.status ?? res?.body?.status?.code ?? res?.body?.status;
        if (status === 201) {
          this.router.navigate(['/admin/guia/listaguias']);
        }
      },
      error: err => {
        console.error(this.editingId() ? 'Error al actualizar la guía:' : 'Error al registrar la guía:', err);
      },
    });
  }

  /* ---------- trackBy ---------- */
  trackById(_: number, item: { id?: number } | any) {
    return item.id ?? _;
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
  filteredProvedores = computed(() => {
    const txt = this.searchProvedor().toLowerCase().trim();
    return this.clienteList().filter(p => p && typeof p.clienteNombre === 'string' && p.clienteNombre.toLowerCase().includes(txt));
  });
  updateSearchProvedor = (txt: string) => this.searchProvedor.set(txt);
  suggestionsProvedor = computed(() => {
    const term = this.searchProvedor().toLowerCase().trim();
    if (!term) return [];
    const selected = this.selectedProvider();
    if (selected && (selected.clienteNombre ?? '').toLowerCase().trim() === term) return [];
    return this.clienteList()
      .filter(p => p.clienteNombre?.toLowerCase().includes(term) || p.clienteNumerodocumento?.toLowerCase().includes(term))
      .slice(0, 10);
  });
  selectProvider(p: Clientes) {
    this.selectedProvider.set(p);
    this.step1.patchValue({ clienteDestinoId: p?.id ?? null });
    this.searchProvedor.set(p?.clienteNombre ?? '');
    this.setUbigeoLlegadaDesdeCliente(p);
    this.clienteService.listarClientes().subscribe({
      next: () => {
        console.log('Cliente actualizado:', p);
      },
      error: err => {
        console.error('Error al actualizar el Cliente:', err);
      },
    });
    this.clienteList();
  }
  clearProvider() {
    this.selectedProvider.set(null);
    this.step1.patchValue({ clienteDestinoId: null });
    this.searchProvedor.set('');
    this.step2.patchValue({
      clienteDepartamento: null,
      clienteProvincia: null,
      clienteDistrito: null,
      envioLlegadaUbigueo: '',
      envioLlegadaDireccion: '',
    });
  }
  //tercero
  filteredTercero = computed(() => {
    const txt = this.searchTercero().toLowerCase().trim();
    return this.clienteList().filter(p => p && typeof p.clienteNombre === 'string' && p.clienteNombre.toLowerCase().includes(txt));
  });
  updateSearchTercero = (txt: string) => this.searchTercero.set(txt);
  suggestionsTercero = computed(() => {
    const term = this.searchTercero().toLowerCase().trim();
    if (!term) return [];
    const selected = this.selectedTercero();
    if (selected && (selected.clienteNombre ?? '').toLowerCase().trim() === term) return [];
    return this.clienteList()
      .filter(p => p.clienteNombre?.toLowerCase().includes(term) || p.clienteNumerodocumento?.toLowerCase().includes(term))
      .slice(0, 10);
  });
  selectTercero(p: Clientes) {
    this.selectedTercero.set(p);
    this.clienteService.listarClientes().subscribe({
      next: () => {
        console.log('Cliente actualizado:', p);
      },
      error: err => {
        console.error('Error al actualizar el Cliente:', err);
      },
    });
    this.clienteList();
  }
  clearTercero() {
    this.selectedTercero.set(null);
  }

  agregarTercero(): void {
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
            this.selectTercero(resultado);
            console.log('Cliente creado:', resultado);
          },
          error: err => {
            console.error('Error al obtener el cliente:', err);
          },
        });
      }
    });
  }

  private setUbigeoLlegadaDesdeCliente(cliente: Clientes) {
    if (!cliente) return;
    if (cliente?.clienteDireccion) {
      this.step2.patchValue({ envioLlegadaDireccion: cliente.clienteDireccion });
    }

    const codigo = cliente?.clienteCodigoubigeo;
    if (!codigo || !/^\d{6}$/.test(String(codigo))) return;

    const dep = String(codigo).slice(0, 2) + '0000';
    const prov = String(codigo).slice(0, 4) + '00';
    const dist = String(codigo).slice(0, 6);

    this.step2.patchValue(
      {
        clienteDepartamento: dep,
        clienteProvincia: prov,
        clienteDistrito: dist,
        envioLlegadaUbigueo: String(codigo),
      },
      { emitEvent: false }
    );

    this.ubigeoService.listarProvincias(dep).subscribe((p: any) => {
      this.provincias.set(p.data ?? p);
      this.ubigeoService.listarDistritos(prov).subscribe((d: any) => {
        this.distritos.set(d.data ?? d);
      });
    });
  }

  private setUbigeoLlegadaDesdeCodigo(codigo: string) {
    if (!/^\d{6}$/.test(codigo)) return;
    const dep = codigo.slice(0, 2) + '0000';
    const prov = codigo.slice(0, 4) + '00';
    const dist = codigo.slice(0, 6);

    this.step2.patchValue(
      {
        clienteDepartamento: dep,
        clienteProvincia: prov,
        clienteDistrito: dist,
        envioLlegadaUbigueo: codigo,
      },
      { emitEvent: false }
    );

    this.ubigeoService.listarProvincias(dep).subscribe((p: any) => {
      this.provincias.set(p.data ?? p);
      this.ubigeoService.listarDistritos(prov).subscribe((d: any) => {
        this.distritos.set(d.data ?? d);
      });
    });
  }

  private setPartidaDesdeEmpresa(ctx: MeResponse) {
    const direccion = ctx?.address?.direccion ?? ctx?.direccion ?? '';
    const codigo = ctx?.address?.ubigueo ?? '';

    if (!this.step2.get('envioPartidaDireccion')?.value && direccion) {
      this.step2.patchValue({ envioPartidaDireccion: direccion });
    }

    if (!/^\d{6}$/.test(String(codigo))) return;
    if (this.step2.get('terceroDepartamento')?.value || this.step2.get('terceroProvincia')?.value || this.step2.get('terceroDistrito')?.value) return;

    const dep = String(codigo).slice(0, 2) + '0000';
    const prov = String(codigo).slice(0, 4) + '00';
    const dist = String(codigo).slice(0, 6);

    this.step2.patchValue(
      {
        terceroDepartamento: dep,
        terceroProvincia: prov,
        terceroDistrito: dist,
        envioPartidaUbigueo: String(codigo),
      },
      { emitEvent: false }
    );

    this.ubigeoService.listarProvincias(dep).subscribe((p: any) => {
      this.provinciasTercero.set(p.data ?? p);
      this.ubigeoService.listarDistritos(prov).subscribe((d: any) => {
        this.distritosTercero.set(d.data ?? d);
      });
    });
  }

  private setUbigeoPartidaDesdeCodigo(codigo: string) {
    if (!/^\d{6}$/.test(codigo)) return;
    const dep = codigo.slice(0, 2) + '0000';
    const prov = codigo.slice(0, 4) + '00';
    const dist = codigo.slice(0, 6);

    this.step2.patchValue(
      {
        terceroDepartamento: dep,
        terceroProvincia: prov,
        terceroDistrito: dist,
        envioPartidaUbigueo: codigo,
      },
      { emitEvent: false }
    );

    this.ubigeoService.listarProvincias(dep).subscribe((p: any) => {
      this.provinciasTercero.set(p.data ?? p);
      this.ubigeoService.listarDistritos(prov).subscribe((d: any) => {
        this.distritosTercero.set(d.data ?? d);
      });
    });
  }

  private setDetallesDesdeGuia(detalles: any[]) {
    while (this.detalles.length) {
      this.detalles.removeAt(0);
    }
    for (const item of detalles ?? []) {
      this.detalles.push(
        this.fb.group({
          detalleId: [item?.id ?? item?.detalleId ?? null],
          productoId: [item?.codigo ?? item?.productoId ?? null, Validators.required],
          descripcion: [item?.descripcion ?? '', Validators.required],
          cantidad: [Number(item?.cantidad ?? 1), [Validators.required, Validators.min(0.01)]],
          unidadMedida: [item?.unidad ?? item?.unidadMedida ?? 'UND'],
          pesoUnitario: [item?.pesoUnitario ?? 0],
        })
      );
    }
  }

  private buildGuiaPayload() {
    const step1 = this.step1.value as any;
    const step2 = this.step2.value as any;
    const step3 = this.step3.value as any;

    const envioFecTraslado = step2.envioFecTraslado instanceof Date ? this.toLocalIso(step2.envioFecTraslado) : step2.envioFecTraslado;

    return {
      tipoDoc: this.tipoDoc,
      serie: this.serie,
      clienteDestinoId: step1.clienteDestinoId ?? this.selectedProvider()?.id ?? null,
      envioCodTraslado: step2.envioCodTraslado,
      envioDesTraslado: step2.envioDesTraslado,
      envioModTraslado: step2.envioModTraslado,
      envioFecTraslado,
      envioCodPuerto: step2.envioCodPuerto,
      envioIndTransbordo: step2.envioIndTransbordo,
      envioPesoTotal: step2.envioPesoTotal,
      envioUndPesoTotal: step2.envioUndPesoTotal,
      envioNumContenedor: step2.envioNumContenedor,
      envioLlegadaUbigueo: step2.envioLlegadaUbigueo || step2.clienteDistrito || '',
      envioLlegadaUbigeo: step2.envioLlegadaUbigueo || step2.clienteDistrito || '',
      envioLlegadaDireccion: step2.envioLlegadaDireccion,
      envioPartidaUbigueo: step2.envioPartidaUbigueo ?? step2.terceroDistrito ?? '',
      envioPartidaDireccion: step2.envioPartidaDireccion,
      envioTransportistaTipoDoc: step3.envioTransportistaTipoDoc,
      envioTransportistaNumDoc: step3.envioTransportistaNumDoc,
      envioTransportistaRznSocial: step3.envioTransportistaRznSocial,
      envioTransportistaPlaca: step3.envioTransportistaPlaca,
      envioTransportistaChoferTipoDoc: step3.envioTransportistaChoferTipoDoc,
      envioTransportistaChoferDoc: step3.envioTransportistaChoferDoc,
      detalle: (this.detalles.value ?? []).map((d: any) => ({
        cantidad: d.cantidad,
        unidad: d.unidadMedida ?? d.unidad ?? '',
        descripcion: d.descripcion ?? '',
        codigo: d.codigo ?? d.productoId ?? '',
        adicional: d.adicional ?? '',
      })),
    };
  }

  private toLocalIso(date: Date) {
    const pad = (n: number) => String(n).padStart(2, '0');
    const y = date.getFullYear();
    const m = pad(date.getMonth() + 1);
    const d = pad(date.getDate());
    const h = pad(date.getHours());
    const min = pad(date.getMinutes());
    const s = pad(date.getSeconds());
    return `${y}-${m}-${d}T${h}:${min}:${s}`;
  }
  departamentos = signal<any[]>([]);
  provincias = signal<any[]>([]);
  distritos = signal<any[]>([]);
  departamentosTercero = signal<any[]>([]);
  provinciasTercero = signal<any[]>([]);
  distritosTercero = signal<any[]>([]);
}












