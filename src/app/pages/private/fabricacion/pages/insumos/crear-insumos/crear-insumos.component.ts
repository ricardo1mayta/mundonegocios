import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { finalize } from 'rxjs';
import { forkJoin } from 'rxjs';
import { InsumoService } from '../../../../../../core/services/insumo/insumo.service';
import { Router } from '@angular/router';

type TipoDTO = { id: number; nombre: string; codigo?: string };
type UnidadDTO = { id: number; nombre: string; codigo: string };

export interface InsumoDialogData {
  insumoId?: number; // si viene, es editar
  idSede?: number; // opcional, para setear sede
}

@Component({
  selector: 'app-crear-insumos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './crear-insumos.component.html',
  styleUrl: './crear-insumos.component.css',
})
export class CrearInsumosComponent implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(InsumoService);
  private ref = inject(MatDialogRef<CrearInsumosComponent>);
  private data = inject(MAT_DIALOG_DATA) as InsumoDialogData;
  private router = inject(Router);
  loading = signal(false);
  error = signal<string | null>(null);

  insumoId = signal<number | null>(null);

  // catálogos
  tipos = signal<TipoDTO[]>([]);
  unidades = signal<UnidadDTO[]>([]);

  form = this.fb.group({
    id: null,
    tipoId: this.fb.control<number | null>(null, { validators: [Validators.required] }),
    nombre: this.fb.control<string>('', { validators: [Validators.required] }),
    unidadCompraId: this.fb.control<number | null>(null),
    unidadConsumoId: this.fb.control<number | null>(null),
    factorConversion: this.fb.control<number>(1),
    costoUnitCompra: this.fb.control<number>(0, { validators: [Validators.required] }),
    activo: this.fb.control<boolean>(true),
    idSede: this.fb.control<number | null>(null),
  });

  ngOnInit(): void {
    // sede default si te la pasan

    if (this.data?.insumoId) {
      this.insumoId.set(this.data.insumoId);
      this.cargarInsumo(this.data.insumoId);
    }
    // cargar catálogos (ajusta a tus endpoints reales)
    this.cargarCatalogos();

    // modo edición
    if (this.data?.insumoId) {
      this.insumoId.set(this.data.insumoId);
      this.cargarInsumo(this.data.insumoId);
    }
  }

  private cargarInsumo(id: number) {
    this.loading.set(true);
    this.api
      .obtenerInsumoPorId(id)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (resp: any) => {
          const x = resp?.data ?? resp;

          // tu API devuelve objetos anidados: tipo{id}, unidadCompra{id}, unidadConsumo{id}
          this.form.patchValue({
            id: x?.id,
            tipoId: x?.tipo?.id ?? null,
            nombre: x?.nombre ?? '',
            unidadCompraId: x?.unidadCompra?.id ?? null,
            unidadConsumoId: x?.unidadConsumo?.id ?? null,
            factorConversion: Number(x?.factorConversion ?? 1),
            costoUnitCompra: Number(x?.costoUnitCompra ?? 0),
            activo: !!x?.activo,
            idSede: x?.idSede ?? this.form.get('idSede')!.value,
          });
        },
        error: e => this.error.set(e?.error?.message || 'Error al cargar insumo'),
      });
  }

  private buildPayload() {
    const v = this.form.getRawValue();
    return {
      id: v.id,
      nombre: v.nombre,
      factorConversion: v.factorConversion,
      costoUnitCompra: v.costoUnitCompra,
      activo: v.activo,
      idSede: v.idSede,

      // IMPORTANTE: manda IDs (para que backend no busque id=0)
      tipo: { id: v.tipoId },
      unidadCompra: v.unidadCompraId ? { id: v.unidadCompraId } : null,
      unidadConsumo: v.unidadConsumoId ? { id: v.unidadConsumoId } : null,
    };
  }

  submit() {
    this.error.set(null);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const payload = this.buildPayload();

    const id = this.insumoId();
    const req$ = id ? this.api.editarInsumo(id, payload) : this.api.registrarInsumo(payload);

    req$.pipe(finalize(() => this.loading.set(false))).subscribe({
      next: () => this.ref.close({ refresh: true }),
      error: e => this.error.set(e?.error?.message || (id ? 'Error al actualizar' : 'Error al crear')),
    });
  }

  cancelar() {
    this.ref.close({ refresh: false });
  }

  private cargarCatalogos() {
    this.loading.set(true);

    forkJoin({
      tipos: this.api.getTiposInsumo(),
      unidades: this.api.getUnidades(),
    })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: ({ tipos, unidades }) => {
          const t = (tipos as any)?.data ?? tipos ?? [];
          const u = (unidades as any)?.data ?? unidades ?? [];

          this.tipos.set(t);
          this.unidades.set(u);

          // defaults opcionales
          if (!this.form.get('tipoId')!.value && t.length) this.form.get('tipoId')!.setValue(t[0].id);
          if (!this.form.get('unidadCompraId')!.value && u.length) this.form.get('unidadCompraId')!.setValue(u[0].id);
          if (!this.form.get('unidadConsumoId')!.value && u.length) this.form.get('unidadConsumoId')!.setValue(u[0].id);
        },
        error: e => this.error.set(e?.error?.message || 'Error al cargar catálogos'),
      });
  }
}



