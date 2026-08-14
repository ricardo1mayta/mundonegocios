import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { MaterialModule } from '../../../../core/modules/material/material.module';
import { RolesService } from '../../../../core/services/roles/roles.service';
import { MatIconModule } from '@angular/material/icon';
import { Rol } from '../../../../core/models/roles/rol';

// Define DialogData interface
export interface DialogData {
  idRol?: number;
  nombreRol?: string;
  descripcionRol?: string;
  idSede?: number;
}

@Component({
  selector: 'app-nuevo-rol',
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './nuevo-rol.component.html',
  styleUrl: './nuevo-rol.component.css',
})
export class NuevoRolComponent {
  form: FormGroup = new FormGroup({
    nombreRol: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(20)],
    }),
    descripcionRol: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(50)],
    }),
  });

  constructor(private dialogRef: MatDialogRef<NuevoRolComponent>, @Inject(MAT_DIALOG_DATA) public data: Rol, private rolesService: RolesService) {
    // Si viene un rol para editar, setear valores
    if (data.idRol) {
      this.form.patchValue({
        nombreRol: data.nombreRol,
        descripcionRol: data.descripcionRol,
      });
    }
  }

  guardar(): void {
    if (this.form.invalid) return;

    const rol: Rol = {
      idRol: this.data.idRol ?? 0,
      ...this.form.value,
    } as Rol;

    const peticion$ = this.data.idRol ? this.rolesService.editarRol(rol.idRol, rol) : this.rolesService.crearRol(rol);

    peticion$.subscribe({
      next: () => this.dialogRef.close(true),
      error: err => console.error('Error guardando rol:', err),
    });
  }

  cerrar(): void {
    this.dialogRef.close(false);
  }
}