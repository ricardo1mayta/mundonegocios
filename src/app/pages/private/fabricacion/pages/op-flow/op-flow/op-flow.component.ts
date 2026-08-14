import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MrpDTO } from '../../../../../../core/models/fabricacion/fabricacion.models';
import { FabricacionApi } from '../../../../../../core/services/fabricacion/fabricacion.api';

@Component({
  selector: 'app-op-flow',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './op-flow.component.html',
  styleUrls: ['./op-flow.component.css'],
})
export class OpFlowComponent {
  private api = inject(FabricacionApi);
  private fb = inject(FormBuilder);

  idOp = signal<number | null>(null);
  mrp = signal<MrpDTO | null>(null);

  idRecepcion = signal<number | null>(null);
  idConsumo = signal<number | null>(null);

  closeId: number | null = null;
  lecciones = '';

  opForm = this.fb.group({
    idCotizacion: [null as any, Validators.required],
    codigo: ['OP-001', Validators.required],
    volumen: [1, [Validators.required, Validators.min(1)]],
  });

  mrpForm = this.fb.group({
    idOp: [null as any, Validators.required],
    idAlmacen: [null as any, Validators.required],
  });

  recForm = this.fb.group({
    idAlmacen: [null as any, Validators.required],
    referencia: [''],
    proveedor: [''],
    detalles: this.fb.array([]),
  });

  get recDetalles(): FormArray {
    return this.recForm.get('detalles') as FormArray;
  }

  consForm = this.fb.group({
    idOp: [null as any, Validators.required],
    idAlmacen: [null as any, Validators.required],
    detalles: this.fb.array([]),
  });

  get consDetalles(): FormArray {
    return this.consForm.get('detalles') as FormArray;
  }

  crearOp() {
    const { idCotizacion, codigo, volumen } = this.opForm.getRawValue() as any;
    this.api.crearOP(idCotizacion, codigo, volumen).subscribe(id => {
      this.idOp.set(id);
      this.mrpForm.patchValue({ idOp: id });
      this.consForm.patchValue({ idOp: id });
      this.closeId = id;
    });
  }

  calcularMrp() {
    const { idOp, idAlmacen } = this.mrpForm.getRawValue() as any;
    this.api.calcularMrp(idOp, idAlmacen).subscribe(m => this.mrp.set(m));
  }

  crearRequisicion() {
    const m = this.mrp();
    if (!m) return;
    this.api.requisicionFromMrp({ idMrp: m.id }).subscribe(id => alert('Requisición creada: ' + id));
  }

  addRecItem() {
    this.recDetalles.push(
      this.fb.group({
        idInsumo: [null as any, Validators.required],
        cantidad: [0, [Validators.required, Validators.min(0.000001)]],
        costoUnit: [0],
      })
    );
  }

  registrarRecepcion() {
    this.api.registrarRecepcion(this.recForm.getRawValue() as any).subscribe(id => this.idRecepcion.set(id));
  }

  validarRecepcion() {
    const id = this.idRecepcion();
    if (!id) return;
    this.api.validarRecepcion(id).subscribe(() => alert('Recepción validada'));
  }

  addConsItem() {
    this.consDetalles.push(
      this.fb.group({
        idInsumo: [null as any, Validators.required],
        cantidad: [0, [Validators.required, Validators.min(0.000001)]],
        costoUnit: [0],
      })
    );
  }

  registrarConsumo() {
    this.api.registrarConsumo(this.consForm.getRawValue() as any).subscribe(id => this.idConsumo.set(id));
  }

  cerrar() {
    if (!this.closeId) return;
    this.api.cerrarOp(this.closeId, this.lecciones || undefined).subscribe(() => alert('OP cerrada'));
  }
}


