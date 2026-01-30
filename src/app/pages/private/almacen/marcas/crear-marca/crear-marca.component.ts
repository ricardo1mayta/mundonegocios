import { Component, Inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MarcasService } from '../../../../../core/services/marcas/marcas.service';
import { Marca } from '../../../../../core/models/almacen/marca';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-crear-marca',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './crear-marca.component.html',
  styleUrl: './crear-marca.component.css',
})
export class CrearMarcaComponent {
  marcaForm!: FormGroup;

  constructor(private fb: FormBuilder, private marcaService: MarcasService, private dialogRef: MatDialogRef<CrearMarcaComponent>, @Inject(MAT_DIALOG_DATA) public data: Marca | null) {}

  ngOnInit(): void {
    this.marcaForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      estado: [true],
      stadoweb: [false],
    });
    console.log('data', this.data);

    if (this.data) {
      this.marcaForm.patchValue(this.data);
    }
  }

  guardarMarca(): void {
    if (this.marcaForm.invalid) {
      this.marcaForm.markAllAsTouched(); // <- solo aquí se activa la validación visual
      return;
    }
    const marca = this.marcaForm.value;
    if (marca.id) {
      this.marcaService.actualizar(marca.id, marca).subscribe(() => {
        this.onCerrar(true);
      });
    } else {
      this.marcaService.crear(marca).subscribe(() => {
        this.onCerrar(true);
      });
    }
  }

  editarMarca(marca: Marca): void {
    this.marcaForm.patchValue(marca);
  }

  limpiarFormulario(): void {
    this.marcaForm.reset({ estado: true, stadoweb: false });
  }
  //cerrar
  cerrarDialogo(): void {
    this.limpiarFormulario();
  }

  onCerrar(ok: boolean = false): void {
    this.dialogRef.close(ok); // devuelve true si fue exitoso
  }
}
