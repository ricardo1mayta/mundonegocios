import { Component, effect, HostListener, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { FabricacionApi } from '../../../../../../core/services/fabricacion/fabricacion.api';
import { Router } from '@angular/router';
import { catchError, debounceTime, distinctUntilChanged, finalize, map, Observable, of, switchMap, tap } from 'rxjs';
import { FichaService } from '../../../../../../core/services/ficha/ficha.service';
import { InsumoService } from '../../../../../../core/services/insumo/insumo.service';
import { FichaOption, InsumoOption } from '../../../../../../core/models/fabricacion/fabricacion.models';
import { BomService } from '../../../../../../core/services/bom/bom.service';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-bom',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIcon],
  templateUrl: './bom.component.html',
  styleUrls: ['./bom.component.css'],
})
export class BomComponent {
  private apiBom = inject(BomService);
  private apiInsumos = inject(InsumoService);
  private fb = inject(FormBuilder);
  private api = inject(FichaService);
  private router = inject(Router);
  loading = signal(false);
  bomId = signal<number | null>(null);
  isEdit = signal(false);
  editingId = signal<number | null>(null);
  fichaId = signal<number | null>(null);
  fichaOptions: FichaOption[] = [];
  openFicha = false;
  bomTotal = signal(0);
  form = this.fb.group({
    id: null,
    idFicha: this.fb.control<number | null>(null, { validators: [Validators.required] }),
    codigo: this.fb.control<string>(''),
    fichaTxt: this.fb.control<string>(''),
    nombre: this.fb.control<string>('BOM-DEFAULT', { validators: [Validators.required] }),
    total: this.fb.control<number>({ value: 0, disabled: true }),
    detalles: this.fb.array([]),
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
    const bomId = nav?.extras.state?.['bomId'] as number | undefined;

    if (fichaId) {
      this.isEdit.set(true);
      //  this.editingId.set(fichaId);
      console.log('Editing purchase with ID:', fichaId);
      this.cargarFicha(fichaId);
    }
    if (bomId) {
      this.isEdit.set(true);
      this.editingId.set(bomId);
      console.log('Editing purchase with ID:', bomId);
      this.cargarBom(bomId);
    }
  }
  // buscar al escribir
  ngOnInit() {
    // ✅ estado: navegación o refresh
    const st = (this.router.getCurrentNavigation()?.extras.state ?? history.state) as any;

    const fichaId = st?.fichaId as number | undefined;
    const bomId = st?.bomId as number | undefined;

    // Si es edición de BOM existente
    if (bomId) {
      this.isEdit.set(true);
      this.editingId.set(bomId);
      this.cargarBom(bomId);
      return;
    }

    // Si es "nuevo BOM desde ficha"
    if (fichaId) {
      this.isEdit.set(false); // 👈 importante: NO es editar BOM
      this.editingId.set(null);
      this.cargarFicha(fichaId);
    }

    // 🔽 tu autocomplete
    this.form
      .get('fichaTxt')!
      .valueChanges.pipe(
        map(v => v ?? ''),
        debounceTime(250),
        distinctUntilChanged(),
        tap(() => {
          this.openFicha = true;
          // ❗Esto está raro: estás poniendo codigo null cuando tipeas fichaTxt.
          // Mejor limpia idFicha, no codigo:
          this.form.get('idFicha')!.setValue(null, { emitEvent: false });
        }),
        switchMap((term): Observable<FichaOption[]> => {
          const q = term.trim();
          if (q.length < 2) return of([]);
          return this.api.opcionesFicha({ q, limit: 10 }).pipe(catchError(() => of([])));
        }),
      )
      .subscribe(opts => (this.fichaOptions = opts));
  }
  private cargarBom(id: number) {
    this.loading.set(true);

    this.isEdit.set(true);
    this.editingId.set(id);
    this.bomId.set(id);

    this.detalles.clear();
    this.optionsByRow = [];
    this.openRow = null;

    this.apiBom
      .obtenerBomPorId(id)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (resp: any) => {
          const bom = resp?.data ?? resp;
          if (!bom) return;

          // Cabecera
          this.form.patchValue({
            id: bom.id ?? id,
            idFicha: bom.idFicha ?? null,
            codigo: bom.codigo ?? '',
            fichaTxt: bom.nombreFicha ?? bom.fichaTxt ?? '', // 👈 tu JSON trae nombreFicha
            nombre: bom.nombre ?? 'BOM-DEFAULT',
          });

          // Si no vino fichaTxt, lo buscamos
          if (bom.idFicha && !this.form.get('fichaTxt')!.value) {
            this.api.obtenerFichaPorId(bom.idFicha).subscribe((r: any) => {
              const f = r?.data;
              if (f) this.form.get('fichaTxt')!.setValue(f.nombre ?? '', { emitEvent: false });
            });
          }

          // Detalles
          const detalles = (bom.detalles ?? []) as any[];
          detalles.forEach((d, idx) => {
            const g = this.fb.nonNullable.group({
              // ✅ tu JSON tiene insumo.id (idInsumo viene null)
              idInsumo: this.fb.control<number | null>(d.insumo?.id ?? d.idInsumo ?? null),

              // ✅ tu JSON tiene insumo.nombre
              insumoTxt: this.fb.control<string>(d.insumo?.nombre ?? ''),

              cantidadPorUnidad: this.fb.control<number>(Number(d.cantidadPorUnidad ?? 0)),
              mermaPct: this.fb.control<number>(Number(d.mermaPct ?? 0)),
              costoUnitCompra: this.fb.control<number>(Number(d.costoUnitCompra ?? 0)),
              total: this.fb.control<number>({ value: 0, disabled: true }),
            });

            this.detalles.push(g);
            this.recalcRow(g);

            g.valueChanges.pipe(debounceTime(50)).subscribe(() => this.recalcRow(g));
            this.optionsByRow[idx] = [];

            // Autocomplete por fila (igual que tu lógica)
            g.get('insumoTxt')!
              .valueChanges.pipe(
                debounceTime(250),
                distinctUntilChanged(),
                tap(() => {
                  this.openRow = idx;
                  g.get('idInsumo')!.setValue(null, { emitEvent: false });
                }),
                switchMap(term => {
                  const q = (term ?? '').trim();
                  if (q.length < 2) return of([] as InsumoOption[]);
                  return this.apiInsumos.opcionesInsumo(q).pipe(catchError(() => of([])));
                }),
              )
              .subscribe(opts => (this.optionsByRow[idx] = opts));
          });
        },
        error: () => {},
      });
  }
  private recalcBomTotal() {
    const sum = this.detalles.controls.map(c => Number((c as any).get('total')?.value ?? 0)).reduce((a, b) => a + b, 0);
    this.bomTotal.set(Number(sum.toFixed(2)));
    const total = Number(sum.toFixed(2));

    this.form.get('total')?.setValue(total, { emitEvent: false });
  }
  private recalcAll() {
    this.detalles.controls.forEach(c => this.recalcRow(c as any));
  }
  private recalcRow(g: any) {
    const costo = Number(g.get('costoUnitCompra')?.value ?? 0);
    const cant = Number(g.get('cantidadPorUnidad')?.value ?? 0);
    const merma = Number(g.get('mermaPct')?.value ?? 0);

    const factorMerma = 1 + merma / 100;
    const total = costo * cant * factorMerma;

    g.get('total')?.setValue(Number(total.toFixed(2)), { emitEvent: false });
    this.recalcBomTotal();
  }
  private cargarFicha(id: number) {
    this.loading.set(true);

    this.api
      .obtenerFichaPorId(id)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (data: any) => {
          const ficha = data?.data;
          if (!ficha) return;

          this.fichaId.set(ficha.id ?? id);

          this.form.patchValue(
            {
              idFicha: ficha.id ?? id,
              codigo: ficha.codigo ?? '',
              fichaTxt: ficha.nombre ?? '', // ✅ para mostrar en input
              nombre: (ficha.nombre ?? 'BOM-DEFAULT') + ' Plantilla',
            },
            { emitEvent: false },
          ); // ✅ evita triggers raros

          this.openFicha = false;
          this.fichaOptions = [];
        },
      });
  }
  get detalles(): FormArray {
    return this.form.get('detalles') as FormArray;
  }
  actualizar() {
    this.recalcAll();
    this.loading.set(true);
    this.apiBom.editarBom(this.bomId(), this.form.getRawValue() as any).subscribe({
      next: (id: any) => {
        this.bomId.set(id.data.id);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
  copiar() {
    // 1) limpia el id del bom (modo "nuevo")
    this.bomId.set(null);
    this.editingId.set(null);
    this.isEdit.set(false);

    // 2) limpia el id del form (si lo tienes)
    this.form.patchValue({ id: null });

    // 3) opcional: cambia nombre para que sea evidente que es copia
    const nombreActual = this.form.get('nombre')!.value ?? '';
    this.form.get('nombre')!.setValue(nombreActual ? `${nombreActual} (copia)` : 'BOM-DEFAULT (copia)');

    // 4) importante: NO toques idFicha ni detalles (se mantienen)
  }

  removeItem(i: number) {
    this.detalles.removeAt(i);
  }

  guardar() {
    this.recalcAll();
    this.loading.set(true);
    const payload = {
      ...this.form.getRawValue(),
      total: this.bomTotal(),
    };
    this.apiBom.registrarBom(payload as any).subscribe({
      next: (id: any) => {
        this.bomId.set(id.data.id);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  //dropdown

  optionsByRow: InsumoOption[][] = [];
  openRow: number | null = null;

  addItem() {
    const g = this.fb.nonNullable.group({
      idInsumo: this.fb.control<number | null>(null),
      insumoTxt: this.fb.control<string>(''),
      costoUnitCompra: this.fb.control<number>(0),
      cantidadPorUnidad: this.fb.control<number>(0),
      mermaPct: this.fb.control<number>(0),
      total: this.fb.control<number>({ value: 0, disabled: true }),
    });
    g.valueChanges.pipe(debounceTime(50)).subscribe(() => this.recalcRow(g));
    const rowIndex = this.detalles.length;
    this.detalles.push(g);
    this.optionsByRow[rowIndex] = [];

    g.get('insumoTxt')!
      .valueChanges.pipe(
        debounceTime(250),
        distinctUntilChanged(),
        tap(() => {
          this.openRow = rowIndex;
          g.get('idInsumo')!.setValue(null, { emitEvent: false });
        }),
        switchMap(term => {
          const q = (term ?? '').trim();
          if (q.length < 2) return of([] as InsumoOption[]);
          return this.apiInsumos.opcionesInsumo(q).pipe(catchError(() => of([])));
        }),
      )
      .subscribe(opts => (this.optionsByRow[rowIndex] = opts));
  }

  selectInsumo(i: number, opt: InsumoOption) {
    const g = this.detalles.at(i) as any;
    g.get('idInsumo').setValue(opt.id);
    g.get('insumoTxt').setValue(opt.nombre, { emitEvent: false }); // muestra nombre sin volver a buscar
    g.get('costoUnitCompra').setValue(opt.costoUnitCompra);
    this.optionsByRow[i] = [];
    this.openRow = null;
  }

  selectFicha(opt: FichaOption) {
    this.form.get('idFicha')!.setValue(opt.id);
    this.form.get('codigo')!.setValue(opt.codigo); // o opt.codigo si tu backend usa string
    this.form.get('fichaTxt')!.setValue(`${opt.nombre}`, { emitEvent: false });
    this.form.get('nombre')!.setValue(opt.nombre + ' Plantilla');

    // si quieres autocompletar nombre plantilla:
    // this.form.get('nombre')!.setValue(opt.nombre, { emitEvent: false });

    this.fichaOptions = [];
    this.openFicha = false;
  }

  // cerrar si haces click fuera
  @HostListener('document:click')
  closeFichaDropdown() {
    this.openFicha = false;
  }
}



