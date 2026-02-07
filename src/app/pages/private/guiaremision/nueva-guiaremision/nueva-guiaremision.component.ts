import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIcon, MatIconModule } from '@angular/material/icon';
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
//import { GuiaRemisionRequest } from './models';

@Component({
  selector: 'app-nueva-guiaremision',
  imports: [CommonModule, FormsModule, MatIconModule, ReactiveFormsModule, MatStepperModule, MatSelectModule, NgxEditorModule, MatIcon, MaterialModule],
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
      envioFecTraslado: [null, Validators.required],
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
  }

  /* ---------- helpers Detalle ---------- */
  get detalles() {
    return this.detalleArr;
  }
  addDetalle() {
    this.detalles.push(
      this.fb.group({
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

  /* ---------- submit ---------- */
  guardar() {
    if (this.step1.invalid || this.step2.invalid || this.step3.invalid) return;

    const payload = {
      ...this.step1.value,
      ...this.step2.value,
      ...this.step3.value,
      detalles: this.detalles.value,
    };
    console.log('Guía de Remisión →', payload);
    // TODO servicio REST
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
    return this.clienteList()
      .filter(p => p.clienteNombre?.toLowerCase().includes(term) || p.clienteNumerodocumento?.toLowerCase().includes(term))
      .slice(0, 10);
  });
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
  //tercero
  filteredTercero = computed(() => {
    const txt = this.searchTercero().toLowerCase().trim();
    return this.clienteList().filter(p => p && typeof p.clienteNombre === 'string' && p.clienteNombre.toLowerCase().includes(txt));
  });
  updateSearchTercero = (txt: string) => this.searchTercero.set(txt);
  suggestionsTercero = computed(() => {
    const term = this.searchTercero().toLowerCase().trim();
    if (!term) return [];
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
    this.searchTercero.set('');
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

  departamentos = signal<any[]>([]);
  provincias = signal<any[]>([]);
  distritos = signal<any[]>([]);
  departamentosTercero = signal<any[]>([]);
  provinciasTercero = signal<any[]>([]);
  distritosTercero = signal<any[]>([]);
}
