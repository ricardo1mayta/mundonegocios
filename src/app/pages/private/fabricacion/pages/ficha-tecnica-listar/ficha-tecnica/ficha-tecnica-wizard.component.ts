import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { MatIconModule } from '@angular/material/icon';
import { FichaService } from '../../../../../../core/services/ficha/ficha.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
type TabKey = 'medidas' | 'piezas' | 'operaciones' | 'adjuntos';
@Component({
  selector: 'app-ficha-tecnica-wizard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './ficha-tecnica-wizard.component.html',
  styleUrls: ['./ficha-tecnica-wizard.component.css'],
})
export class FichaTecnicaWizardComponent {
  private fb = inject(FormBuilder);
  private api = inject(FichaService);
  private router = inject(Router);
  tab: TabKey = 'medidas';
  showGeneral = true;
  step = signal(1);
  loading = signal(false);
  fichaId = signal<number | null>(null);
  isEdit = signal(false);
  editingId = signal<number | null>(null);
  form = this.fb.group({
    idModelo: [null as any],
    codigo: ['', Validators.required],
    version: ['v1', Validators.required],
    nombre: ['', Validators.required],
    descripcion: [''],

    medidas: this.fb.array([]),
    piezas: this.fb.array([]),
    operaciones: this.fb.array([]),
    adjuntos: this.fb.array([]),
  });

  constructor() {
    effect(() => {
      //this.search();
      // this.selCat();
      //this.page.set(1);
      //this.providerList();
    });

    const nav = this.router.getCurrentNavigation();
    const fichaId = nav?.extras.state?.['fichaId'] as number | undefined;

    if (fichaId) {
      this.isEdit.set(true);
      this.editingId.set(fichaId);
      console.log('Editing purchase with ID:', fichaId);
      this.cargarFicha(fichaId);
    }
  }
  imprimir() {
    window.print();
  }
  private cargarFicha(id: number) {
    this.loading.set(true);

    this.api
      .obtenerFichaPorId(id)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (data: any) => {
          const ficha = data.data;
          if (!ficha) return;
          console.log(ficha);
          // 1) id de la ficha
          this.fichaId.set(ficha.id ?? ficha.fichaId ?? id);

          // 2) Datos generales (patch para no romper si faltan campos)
          this.form.patchValue({
            idModelo: ficha.idModelo ?? ficha.modeloId ?? null,
            codigo: ficha.codigo ?? '',
            version: ficha.version ?? 'v1',
            nombre: ficha.nombre ?? '',
            descripcion: ficha.descripcion ?? '',
          });

          // 3) Arrays (soporta distintos nombres)
          const medidasSrc = ficha.medidas ?? ficha.detalleMedidas ?? ficha.medidasList ?? [];

          const piezasSrc = ficha.piezas ?? ficha.detallePiezas ?? ficha.piezasList ?? [];

          const operacionesSrc = ficha.operaciones ?? ficha.detalleOperaciones ?? ficha.operacionesList ?? [];

          const adjuntosSrc = ficha.adjuntos ?? ficha.detalleAdjuntos ?? ficha.adjuntosList ?? [];

          // 4) Limpiar arrays actuales
          this.clearFormArray(this.medidas);
          this.clearFormArray(this.piezas);
          this.clearFormArray(this.operaciones);
          this.clearFormArray(this.adjuntos);

          // 5) Cargar medidas
          for (const m of Array.isArray(medidasSrc) ? medidasSrc : []) {
            this.medidas.push(
              this.fb.group({
                talla: [m.talla ?? '', Validators.required],
                parte: [m.parte ?? '', Validators.required],
                valor: [Number(m.valor ?? 0), Validators.required],
                tolerancia: [Number(m.tolerancia ?? 0)],
              }),
            );
          }

          // 6) Cargar piezas
          for (const p of Array.isArray(piezasSrc) ? piezasSrc : []) {
            this.piezas.push(
              this.fb.group({
                nombre: [p.nombre ?? '', Validators.required],
                cantidad: [Number(p.cantidad ?? 1), [Validators.required, Validators.min(1)]],
                observacion: [p.observacion ?? ''],
              }),
            );
          }

          // 7) Cargar operaciones (reindex por si vienen huecos)
          for (const o of Array.isArray(operacionesSrc) ? operacionesSrc : []) {
            this.operaciones.push(
              this.fb.group({
                orden: [Number(o.orden ?? 0), [Validators.required, Validators.min(1)]],
                descripcion: [o.descripcion ?? '', Validators.required],
                tiempoMin: [Number(o.tiempoMin ?? 0), [Validators.min(0)]],
              }),
            );
          }
          this.reindexOperaciones();

          // 8) Cargar adjuntos
          for (const a of Array.isArray(adjuntosSrc) ? adjuntosSrc : []) {
            this.adjuntos.push(
              this.fb.group({
                tipo: [a.tipo ?? 'IMAGEN', Validators.required],
                nombre: [a.nombre ?? a.fileName ?? ''],
                url: [a.url ?? ''],
              }),
            );
          }

          // 9) UX: abrir generales y quedarte en paso 1
          this.showGeneral = true;
          this.step.set(1);

          // Si quieres que nunca queden vacíos:
          // this.ensurePiezasRow();
          // this.ensureOperacionesRow();
          // this.ensureAdjuntosRow();
        },
        error: () => {
          // aquí puedes mostrar toast si quieres
        },
      });
  }

  private clearFormArray(arr: FormArray) {
    while (arr.length) arr.removeAt(0);
  }
  /* ===== Getters ===== */
  get medidas() {
    return this.form.get('medidas') as FormArray;
  }
  get piezas() {
    return this.form.get('piezas') as FormArray;
  }
  get operaciones() {
    return this.form.get('operaciones') as FormArray;
  }
  get adjuntos() {
    return this.form.get('adjuntos') as FormArray;
  }

  /* ===== Navegación ===== */
  next() {
    if (this.step() < 5) this.step.update(s => s + 1);
  }
  prev() {
    if (this.step() > 1) this.step.update(s => s - 1);
  }

  // ===== UI =====
  toggleGeneral(): void {
    this.showGeneral = !this.showGeneral;
  }
  isInvalid(controlName: 'codigo' | 'nombre' | 'version'): boolean {
    const c = this.form.get(controlName);
    return !!c && c.invalid && (c.touched || c.dirty);
  }

  private touchAll(): void {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();
  }
  /* ===== CRUD ===== */
  guardar() {
    this.touchAll();
    Swal.fire({
      title: '',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    }).then(result => {
      if (result.isConfirmed) {
        if (this.form.invalid) {
          this.showGeneral = true; // abre datos generales si falta algo
          return;
        }
        this.loading.set(true);
        this.api.registrarFicha(this.form.getRawValue()).subscribe({
          next: r => {
            this.loading.set(false);
            this.limpiarTodo();
            this.next();
          },
          error: () => this.loading.set(false),
        });
        Swal.fire('', 'Acción realizada correctamente.', 'success');
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('', 'No se realizaron cambios.', 'info');
      }
    });
    console.log(this.form, this.form.invalid);
  }
  actualizar() {
    const id = this.fichaId();
    if (!id) return;

    this.touchAll();
    if (this.form.invalid) {
      this.showGeneral = true;
      return;
    }

    Swal.fire({
      title: '',
      text: 'Se guardarán los cambios.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, actualizar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    }).then(({ isConfirmed }) => {
      if (!isConfirmed) return;

      this.loading.set(true);

      this.api.editarFicha(id, this.form.getRawValue()).subscribe({
        next: () => {
          this.loading.set(false);
          Swal.fire('', 'Cambios guardados.', 'success');

          this.next();
        },
        error: () => {
          this.loading.set(false);
          Swal.fire('', 'No se pudo actualizar.', 'error');
        },
      });
    });
  }
  duplicar() {
    // 1) Ya no es edición
    this.fichaId.set(null);
    this.isEdit.set(false);
    this.editingId.set(null);

    // 2) Nombre = "Nombre actual copy - YYYY-MM-DD HH:mm"
    const nombreActual = (this.form.get('nombre')?.value ?? '').toString().trim();

    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const stamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ` + `${pad(now.getHours())}:${pad(now.getMinutes())}`;

    const nuevoNombre = `${nombreActual} copy - ${stamp}`.trim();

    this.form.get('nombre')?.setValue(nuevoNombre);
    this.form.get('nombre')?.markAsDirty();
  }

  aprobar() {
    const id = this.fichaId();
    if (!id) return;
    //this.api.aprobar(id).subscribe(() => alert('Ficha técnica APROBADA'));
  }

  /* ===== Medidas ===== */
  addMedida() {
    this.medidas.push(
      this.fb.group({
        talla: ['', Validators.required],
        parte: ['', Validators.required],
        valor: [0, Validators.required],
        tolerancia: [0],
      }),
    );
  }
  removeMedida(i: number) {
    this.medidas.removeAt(i);
  }

  addPieza() {
    this.piezas.push(
      this.fb.group({
        nombre: ['', Validators.required], // ej: Manga, Espalda, Cuello
        cantidad: [1, [Validators.required, Validators.min(1)]],
        observacion: [''], // opcional
      }),
    );
  }

  removePieza(i: number) {
    this.piezas.removeAt(i);
  }

  // (opcional) para que el paso 3 no salga vacío
  ensurePiezasRow() {
    if (this.piezas.length === 0) this.addPieza();
  }

  addOperacion() {
    const nextOrden = this.operaciones.length + 1;

    this.operaciones.push(
      this.fb.group({
        orden: [nextOrden, [Validators.required, Validators.min(1)]],
        descripcion: ['', Validators.required],
        tiempoMin: [0, [Validators.min(0)]],
      }),
    );
  }

  removeOperacion(i: number) {
    this.operaciones.removeAt(i);
    this.reindexOperaciones();
  }

  /** Reasigna orden 1..N según el índice actual */
  reindexOperaciones() {
    this.operaciones.controls.forEach((ctrl, idx) => {
      ctrl.get('orden')?.setValue(idx + 1, { emitEvent: false });
    });
  }

  moveOperacionUp(i: number) {
    if (i <= 0) return;
    const current = this.operaciones.at(i);
    const prev = this.operaciones.at(i - 1);
    this.operaciones.setControl(i - 1, current);
    this.operaciones.setControl(i, prev);
    this.reindexOperaciones();
  }

  moveOperacionDown(i: number) {
    if (i >= this.operaciones.length - 1) return;
    const current = this.operaciones.at(i);
    const next = this.operaciones.at(i + 1);
    this.operaciones.setControl(i + 1, current);
    this.operaciones.setControl(i, next);
    this.reindexOperaciones();
  }

  ensureOperacionesRow() {
    if (this.operaciones.length === 0) this.addOperacion();
  }

  /** Total de minutos (suma de tiempoMin) */
  totalMin(): number {
    return this.operaciones.controls.reduce((acc, c) => {
      const v = Number(c.get('tiempoMin')?.value ?? 0);
      return acc + (isNaN(v) ? 0 : v);
    }, 0);
  }

  /* ===== Adjuntos ===== */

  addAdjunto() {
    this.adjuntos.push(
      this.fb.group({
        tipo: ['IMAGEN', Validators.required], // IMAGEN | PDF | MOLDE
        nombre: [''],
        url: [''], // por ahora URL
      }),
    );
  }

  removeAdjunto(i: number) {
    this.adjuntos.removeAt(i);
  }

  ensureAdjuntosRow() {
    if (this.adjuntos.length === 0) this.addAdjunto();
  }

  isImageUrl(url: string | null | undefined): boolean {
    if (!url) return false;
    const u = url.toLowerCase().trim();
    return u.endsWith('.png') || u.endsWith('.jpg') || u.endsWith('.jpeg') || u.endsWith('.webp') || u.includes('image');
  }

  selectedFiles: Record<number, File | null> = {};
  uploading: Record<number, boolean> = {};

  onFileSelected(evt: Event, i: number): void {
    const input = evt.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const tipo = this.adjuntos.at(i).get('tipo')?.value;

    const isPdf = file.type === 'application/pdf';
    const isImg = file.type.startsWith('image/');

    if ((tipo === 'PDF' && !isPdf) || (tipo === 'IMAGEN' && !isImg)) {
      this.selectedFiles[i] = null;
      input.value = '';
      alert(`Tipo inválido. Debe ser ${tipo === 'PDF' ? 'PDF' : 'imagen'}.`);
      return;
    }

    this.selectedFiles[i] = file;
  }

  uploadAdjunto(i: number): void {
    const file = this.selectedFiles[i];
    if (!file) return;

    this.uploading[i] = true;

    const fd = new FormData();
    fd.append('file', file);
  }
  private limpiarTodo(): void {
    // Limpia form arrays
    this.clearFormArray(this.medidas);
    this.clearFormArray(this.piezas);
    this.clearFormArray(this.operaciones);
    this.clearFormArray(this.adjuntos);

    // Limpia archivos seleccionados
    this.selectedFiles = {};
    this.uploading = {};

    // Resetea generales (con defaults)
    this.form.reset({
      idModelo: null,
      codigo: '',
      version: 'v1',
      nombre: '',
      descripcion: '',
      medidas: [],
      piezas: [],
      operaciones: [],
      adjuntos: [],
    });

    // Resetea flags/estado del wizard
    this.fichaId.set(null);
    this.isEdit.set(false);
    this.editingId.set(null);

    this.showGeneral = true;
    this.tab = 'medidas';
    this.step.set(1);

    // Opcional: si quieres que no queden vacíos
    // this.addPieza();
    // this.addOperacion();
    // this.addAdjunto();
  }
}



