import { Component, effect, inject, signal } from '@angular/core';
import { ModalComponent } from '../../../../core/components/modal/modal.component';
import { FormBuilder, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Clientes } from '../../../../core/models/ventas/clientes';
import { ClientesService } from '../../../../core/services/clientes/clientes.service';
import { CommonModule } from '@angular/common';
import { MatDialogContent, MatDialogActions, MatDialogClose, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { UbigeoService } from '../../../../core/services/ubigeo/ubigeo.service';
import { CodigosService } from '../../../../core/services/codigos/codigos.service';
import { SunatService } from '../../../../core/services/codigos/sunat.service';
import { ProvedoresService } from '../../../../core/services/provedores/provedores.service';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatStepperModule } from '@angular/material/stepper';
import { NgxEditorModule } from 'ngx-editor';
import { MaterialModule } from '../../../../core/modules/material/material.module';

type CrearProveedorData = {
  provedor?: {
    id?: number;
    tipodocumento?: string;
    numerodocumento?: string;
    nombre?: string;
    direccion?: string;
    pais?: string;
    ciudad?: string;
    departamento?: string;
    provincia?: string;
    distrito?: string;
    codigoubigeo?: string;
    email?: string;
    telefono?: string;
  };
};
@Component({
  selector: 'app-crear-proveedores',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatStepperModule, MatSelectModule, MatSlideToggleModule, MatDialogModule, NgxEditorModule, MatIcon, MaterialModule, MatIconModule, MatDialogContent],
  templateUrl: './crear-proveedores.component.html',
  styleUrl: './crear-proveedores.component.css',
})
export class CrearProveedoresComponent {
  /* -------- catálogos -------- */
  tiposDocumento = signal<any[]>([]);
  departamentos = signal<any[]>([]);
  provincias = signal<any[]>([]);
  distritos = signal<any[]>([]);

  private fb = inject(NonNullableFormBuilder);
  private dialogRef = inject(MatDialogRef<CrearProveedoresComponent>);
  private provSrv = inject(ProvedoresService);
  private sunat = inject(SunatService);
  private codigos = inject(CodigosService);
  private ubigeoSrv = inject(UbigeoService);
  private data = inject(MAT_DIALOG_DATA) as CrearProveedorData;

  /* PASO 1 – Documento */
  docForm = this.fb.group({
    tipodocumento: ['1', Validators.required],
    numerodocumento: ['', [Validators.required, Validators.minLength(6)]],
    nombre: ['', Validators.required],
  });

  /* PASO 2 – Dirección */
  dirForm = this.fb.group({
    direccion: ['', Validators.required],
    pais: ['PE'],
    ciudad: [''],
    departamento: [''],
    provincia: [''],
    distrito: [''],
    codigoubigeo: [''],
  });

  /* PASO 3 – Contacto */
  contactoForm = this.fb.group({
    email: [''],
    telefono: [''],
  });

  constructor() {
    /* cargar catálogos */
    this.codigos.listarTiposCodigo(1).subscribe((r: any) => this.tiposDocumento.set(r.data ?? r));
    this.ubigeoSrv.listarDepartamentos().subscribe((r: any) => this.departamentos.set(r.data ?? r));

    /* cascada ubigeo */
    this.dirForm.get('departamento')!.valueChanges.subscribe(dep => {
      if (!dep) {
        this.provincias.set([]);
        this.distritos.set([]);
        return;
      }
      this.ubigeoSrv.listarProvincias(dep).subscribe((p: any) => {
        this.provincias.set(p.data ?? p);
        this.distritos.set([]);
      });
    });

    this.dirForm.get('provincia')!.valueChanges.subscribe(prov => {
      const dep = this.dirForm.get('departamento')!.value;
      if (!dep || !prov) {
        this.distritos.set([]);
        return;
      }
      this.ubigeoSrv.listarDistritos(prov).subscribe((d: any) => this.distritos.set(d.data ?? d));
    });

    /* edición */
    if (this.data?.provedor) {
      const p = this.data.provedor;
      this.docForm.patchValue({
        tipodocumento: p.tipodocumento,
        numerodocumento: p.numerodocumento,
        nombre: p.nombre,
      });
      this.dirForm.patchValue({
        direccion: p.direccion,
        pais: p.pais,
        ciudad: p.ciudad,
        departamento: p.departamento,
        provincia: p.provincia,
        distrito: p.distrito,
        codigoubigeo: p.codigoubigeo,
      });
      this.contactoForm.patchValue({ email: p.email, telefono: p.telefono });
      if (p.codigoubigeo) this.seteaUbigeo(p.codigoubigeo);
    }
  }

  /* ------------ búsqueda SUNAT/RENIEC (igual que antes) ------------- */
  buscarEnSunat(): void {
    // validar por el tipo de documento dni 1 y ruc 6 si es otro mayor a 6 caracteres
    const tipoDocumento = this.docForm.get('tipodocumento')?.value ?? '';
    const numeroDocumento = this.docForm.get('numerodocumento')?.value ?? '';

    if (tipoDocumento === '1' && numeroDocumento && numeroDocumento.length === 8) {
      // Buscar persona en RENIEC
      this.sunat.getPersonaReniec('' + numeroDocumento).subscribe({
        next: (response: any) => {
          if (response.data) {
            this.docForm.patchValue({
              nombre: response.data.nombre_completo,
            });
            this.dirForm.patchValue({
              direccion: response.data.direccion,
            });
          } else {
            console.warn('No se encontró información para el DNI proporcionado');
          }
        },
        error: err => console.error('Error al buscar en RENIEC', err),
      });
    } else if (tipoDocumento === '2' && numeroDocumento && numeroDocumento.length >= 11) {
      // Buscar persona en SUNAT
      this.sunat.getEmpresaSunat('' + numeroDocumento).subscribe({
        next: (response: any) => {
          if (response.data) {
            this.docForm.patchValue({
              nombre: response.data.nombre_o_razon_social,
            });
            this.dirForm.patchValue({
              direccion: response.data.direccion,
              departamento: response.data.departamento,
            });
            this.seteaUbigeo(response.data.ubigeo_sunat);
          } else {
            console.warn('No se encontró información para el RUC proporcionado');
          }
        },
        error: err => console.error('Error al buscar en SUNAT', err),
      });
    } else {
      console.warn('Tipo de documento no soportado o número de documento inválido');
    }
  }

  seteaUbigeo(codigo: string): void {
    if (!/^\d{6}$/.test(codigo)) {
      console.warn('Código de ubigeo inválido →', codigo);
      return;
    }

    // Códigos en el formato que espera tu API
    const dep = codigo.slice(0, 2) + '0000';
    const prov = codigo.slice(0, 4) + '00';
    const dist = codigo.slice(0, 6);

    this.dirForm.patchValue(
      {
        departamento: dep,
        provincia: prov,
        distrito: dist,
        codigoubigeo: codigo,
      },
      { emitEvent: false }
    );
    this.ubigeoSrv.listarProvincias(dep).subscribe((p: any) => {
      this.provincias.set(p.data ?? p);

      this.ubigeoSrv.listarDistritos(prov).subscribe((d: any) => {
        this.distritos.set(d.data ?? d);
      });
    });
  }
  /* --------------- guardar --------------- */
  private body() {
    const base = { ...this.docForm.value, ...this.dirForm.value, ...this.contactoForm.value };
    // If editing, add the id property from the data
    if (this.data?.provedor?.id) {
      return { ...base, id: this.data.provedor.id };
    }
    return base;
  }

  guardar() {
    if (this.docForm.invalid || this.dirForm.invalid) return;
    const payload = this.body();
    const id = this.data?.provedor?.id;
    const req$ = id ? this.provSrv.actualizarProvedor(id, { ...payload, codigoubigeo: payload.distrito }) : this.provSrv.registrarProvedor({ ...payload, codigoubigeo: payload.distrito });

    req$.subscribe({
      next: (r: any) => this.dialogRef.close(r),
      error: e => console.error(e),
    });
  }
}
