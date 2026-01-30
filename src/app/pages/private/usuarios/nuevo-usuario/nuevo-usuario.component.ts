import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { MaterialModule } from '../../../../core/modules/material/material.module';
import { RolesService } from '../../../../core/services/roles/roles.service';
import { SedesService } from '../../../../core/services/sedes/sedes.service';
import { Rol } from '../../../../core/models/roles/rol';
import { Sede } from '../../../../core/models/sedes/sedes';
import { UsuarioService } from '../../../../core/services/usuario/usuario.service';
import { Usuario } from '../../../../core/models/usuario';

@Component({
  selector: 'app-nuevo-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatStepperModule, MatSelectModule, MatSlideToggleModule, MatIconModule, MatDialogModule, MaterialModule],
  templateUrl: './nuevo-usuario.component.html',
  styleUrl: './nuevo-usuario.component.css',
})
export class NuevoUsuarioComponent implements OnInit {
  /* PASO 1 */
  personalesForm: FormGroup;
  /* PASO 2 */
  configForm: FormGroup;

  /* Catálogos */
  roles: Rol[] = [];
  sedes: Sede[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<NuevoUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Usuario,
    private usuariosService: UsuarioService,
    private rolesService: RolesService,
    private sedesService: SedesService
  ) {
    /* construir forms DENTRO del constructor */
    this.personalesForm = this.fb.group({
      username: ['', Validators.required],
      emailUser: ['', [Validators.required, Validators.email]],
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      img: [''],
    });

    this.configForm = this.fb.group({
      activo: [true, Validators.required],
      tipoUser: ['USR', Validators.required],
      idcodTipoUser: [0],
      idSede: [null, Validators.required],
      rolesIds: [[] as number[]],
    });
  }

  ngOnInit(): void {
    /* cargar catálogos */
    this.rolesService.obtenerTodosLosRoles().subscribe((r: any) => (this.roles = r.data as Rol[]));
    this.sedesService.obtenerTodasLasSedes().subscribe((s: any) => (this.sedes = s.data as Sede[]));
    console.log('Sedes', this.data);
    /* edición */
    if (this.data) {
      const u = this.data as Usuario;
      this.personalesForm.patchValue({
        username: u.username,
        emailUser: u.emailUser,
        nombres: u.nombres,
        apellidos: u.apellidos,
        img: u.img,
      });
      this.configForm.patchValue({
        activo: u.activo,
        tipoUser: u.tipoUser,
        idcodTipoUser: u.idcodTipoUser,
        idSede: u.idSede,
        rolesIds: u.roles.map(r => r.idRol),
      });
    }
  }

  /* Combinar payload */
  private payload() {
    return {
      ...this.personalesForm.value,
      ...this.configForm.value,
    };
  }

  guardar(): void {
    const body = this.payload();
    const pet$ = this.data.idUser ? this.usuariosService.editarUsuario(this.data.idUser!, body) : this.usuariosService.crearUsuario(body);

    pet$.subscribe({
      next: () => this.dialogRef.close(true),
      error: err => console.error('Error guardando usuario', err),
    });
  }
}
