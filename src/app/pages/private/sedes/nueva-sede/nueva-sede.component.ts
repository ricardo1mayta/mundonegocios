import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatDialogContent, MatDialogActions, MatDialogClose, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Sede } from '../../../../core/models/sedes/sedes';
import { SedesService } from '../../../../core/services/sedes/sedes.service';
import { DialogData } from '../../roles/nuevo-rol/nuevo-rol.component';
import { MaterialModule } from '../../../../core/modules/material/material.module';
import { MatStepperModule } from '@angular/material/stepper';
@Component({
  selector: 'app-nueva-sede',
  imports: [MatStepperModule, MaterialModule, CommonModule, ReactiveFormsModule, MatDialogClose, MatIconModule, MatDialogContent],
  templateUrl: './nueva-sede.component.html',
  styleUrl: './nueva-sede.component.css',
})
export class NuevaSedeComponent {
  /** Paso 1 */
  datosGeneralesForm: FormGroup;
  /** Paso 2 */
  direccionForm: FormGroup;
  /** Paso 3 */
  contactoForm: FormGroup;
  /** Paso 4 */
  textosForm: FormGroup;

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<NuevaSedeComponent>, @Inject(MAT_DIALOG_DATA) public data: Sede, private sedesService: SedesService) {
    this.datosGeneralesForm = this.fb.group({
      ruc: ['', [Validators.required, Validators.pattern(/^[0-9]{11}$/)]],
      tipoDoc: ['1', Validators.required],
      nombresede: ['', Validators.required],
      nomComercial: ['', Validators.required],
      razonSocial: ['', Validators.required],
    });

    this.direccionForm = this.fb.group({
      direccion: ['', Validators.required],
      direccion2: [''],
      direccionDepartamento: [''],
      direccionProvincia: [''],
      direccionDistrito: [''],
      codigoUbigeo: [''],
    });

    this.contactoForm = this.fb.group({
      telefono: [''],
      publicaenweb: [false, Validators.required],
      logoImpresion: [''],
      imagen: [''],
    });

    this.textosForm = this.fb.group({
      textogarantia: [''],
      info: [''],
      info2: [''],
    });

    if (data.id) {
      const sede = data as Sede;
      // Cargar datos y hacer patchValue a los 4 form groups

      this.datosGeneralesForm.patchValue({
        ruc: sede.ruc,
        tipoDoc: sede.tipoDoc,
        nombresede: sede.nombresede,
        nomComercial: sede.nomComercial,
        razonSocial: sede.razonSocial,
      });
      this.direccionForm.patchValue({
        direccion: sede.direccion,
        direccion2: sede.direccion2,
        direccionDepartamento: sede.direccionDepartamento,
        direccionProvincia: sede.direccionProvincia,
        direccionDistrito: sede.direccionDistrito,
        codigoUbigeo: sede.codigoUbigeo,
      });
      this.contactoForm.patchValue({
        telefono: sede.telefono,
        publicaenweb: sede.publicaenweb,
        logoImpresion: sede.logoImpresion,
        imagen: sede.imagen,
      });
      this.textosForm.patchValue({
        textogarantia: sede.textogarantia,
        info: sede.info,
        info2: sede.info2,
      });
    }
  }

  /** Combina los cuatro form groups en un solo objeto para enviar */
  buildPayload() {
    return {
      ...this.datosGeneralesForm.value,
      ...this.direccionForm.value,
      ...this.contactoForm.value,
      ...this.textosForm.value,
    };
  }

  guardar() {
    const payload = this.buildPayload();
    const peticion$ =
      this.data.id && this.data.tipo === 'duplicate' ? this.sedesService.crearSede(payload) : this.data.id ? this.sedesService.editarSede(this.data.id, payload) : this.sedesService.crearSede(payload);

    peticion$.subscribe({
      next: () => this.dialogRef.close(true),
      error: err => console.error('Error guardando sede', err),
    });
  }
}
