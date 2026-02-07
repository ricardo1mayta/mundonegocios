import { Component, effect, inject, signal } from '@angular/core';
import { ModalComponent } from '../../../../core/components/modal/modal.component';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ClientesService } from '../../../../core/services/clientes/clientes.service';
import { CommonModule } from '@angular/common';
import { MatDialogContent, MatDialogActions, MatDialogClose, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { UbigeoService } from '../../../../core/services/ubigeo/ubigeo.service';
import { CodigosService } from '../../../../core/services/codigos/codigos.service';
import { SunatService } from '../../../../core/services/codigos/sunat.service';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { NgxEditorModule } from 'ngx-editor';
import { MaterialModule } from '../../../../core/modules/material/material.module';

type EditarClienteData = {
  cliente?: {
    id?: number;
    clienteTipodocumento?: string;
    clienteNumerodocumento?: string;
    clienteNombre?: string;
    clienteDireccion?: string;
    clientePais?: string;
    clienteCiudad?: string;
    clienteDepartamento?: string;
    clienteProvincia?: string;
    clienteDistrito?: string;
    clienteCodigoubigeo?: string;
    clienteEmail?: string;
    clienteTelefono?: string;
  };
};
@Component({
  selector: 'app-editar-cliente',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatStepperModule, MatSelectModule, MatDialogModule, NgxEditorModule, MatIcon, MaterialModule, MatIconModule, MatDialogContent],
  templateUrl: './editar-cliente.component.html',
  styleUrl: './editar-cliente.component.css',
})
export class EditarClienteComponent {
  private fb = inject(NonNullableFormBuilder);
  private dialogRef = inject(MatDialogRef<EditarClienteComponent, unknown>);
  private clienteService = inject(ClientesService);
  private codigos = inject(CodigosService);
  private sunat = inject(SunatService);
  private ubigeoService = inject(UbigeoService);
  private data = inject(MAT_DIALOG_DATA) as EditarClienteData;

  /* Catálogos signals */
  tiposDocumento = signal<any[]>([]);
  departamentos = signal<any[]>([]);
  provincias = signal<any[]>([]);
  distritos = signal<any[]>([]);

  /* STEP 1 – Documento */
  docForm = this.fb.group({
    clienteTipodocumento: ['1', Validators.required],
    clienteNumerodocumento: ['', [Validators.required, Validators.minLength(6)]],
    clienteNombre: ['', Validators.required],
  });

  /* STEP 2 – Dirección */
  dirForm = this.fb.group({
    clienteDireccion: ['', Validators.required],
    clientePais: ['PE'],
    clienteCiudad: [''],
    clienteDepartamento: [''],
    clienteProvincia: [''],
    clienteDistrito: [''],
    clienteCodigoubigeo: [''],
  });

  /* STEP 3 – Contacto */
  contactoForm = this.fb.group({
    clienteEmail: [''],
    clienteTelefono: [''],
  });

  /* ---------------- INIT ---------------- */
  constructor() {
    /* catálogo doc/departamentos */
    this.codigos.listarTiposCodigo(1).subscribe((r: any) => this.tiposDocumento.set(r.data ?? r));
    this.ubigeoService.listarDepartamentos().subscribe((r: any) => this.departamentos.set(r.data ?? r));

    /* cascading ubigeo */
    this.dirForm.get('clienteDepartamento')!.valueChanges.subscribe(dep => {
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

    this.dirForm.get('clienteProvincia')!.valueChanges.subscribe(prov => {
      const dep = this.dirForm.get('clienteDepartamento')!.value;
      if (dep && prov) {
        this.ubigeoService.listarDistritos(prov).subscribe((d: any) => this.distritos.set(d.data ?? d));
      } else this.distritos.set([]);
    });

    /* edición */
    if (this.data?.cliente) {
      const c = this.data.cliente;
      this.docForm.patchValue({
        clienteTipodocumento: c.clienteTipodocumento,
        clienteNumerodocumento: c.clienteNumerodocumento,
        clienteNombre: c.clienteNombre,
      });
      this.dirForm.patchValue({
        clienteDireccion: c.clienteDireccion,
        clientePais: c.clientePais,
        clienteCiudad: c.clienteCiudad,
        clienteDepartamento: c.clienteDepartamento,
        clienteProvincia: c.clienteProvincia,
        clienteDistrito: c.clienteDistrito,
        clienteCodigoubigeo: c.clienteCodigoubigeo,
      });
      this.contactoForm.patchValue({
        clienteEmail: c.clienteEmail,
        clienteTelefono: c.clienteTelefono,
      });
      if (c.clienteCodigoubigeo) this.seteaUbigeo(c.clienteCodigoubigeo);
    }
  }

  /**------ Sunat / Reniec búsqueda idéntica --------*/
  buscarEnSunat(): void {
    // validar por el tipo de documento dni 1 y ruc 6 si es otro mayor a 6 caracteres
    const tipoDocumento = this.docForm.get('clienteTipodocumento')?.value as string;
    const numeroDocumento = this.docForm.get('clienteNumerodocumento')?.value as string;

    if (tipoDocumento === '1' && numeroDocumento && numeroDocumento.length === 8) {
      // Buscar persona en RENIEC
      this.sunat.getPersonaReniec('' + numeroDocumento).subscribe({
        next: (response: any) => {
          if (response.data) {
            this.docForm.patchValue({
              clienteNombre: response.data.nombre_completo,
            });
            this.dirForm.patchValue({
              clienteDireccion: response.data.direccion,
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
              clienteNombre: response.data.nombre_o_razon_social,
            });
            this.dirForm.patchValue({
              clienteDireccion: response.data.direccion,
              clienteCiudad: response.data.departamento,
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
        clienteDepartamento: dep,
        clienteProvincia: prov,
        clienteDistrito: dist,
        clienteCodigoubigeo: codigo,
      },
      { emitEvent: false }
    );
    this.ubigeoService.listarProvincias(dep).subscribe((p: any) => {
      this.provincias.set(p.data ?? p);

      this.ubigeoService.listarDistritos(prov).subscribe((d: any) => {
        this.distritos.set(d.data ?? d);
      });
    });
  }

  /* Combina los 3 formularios */
  private payload() {
    return { ...this.docForm.value, ...this.dirForm.value, ...this.contactoForm.value };
  }

  guardar() {
    if (this.docForm.invalid || this.dirForm.invalid) return;
    const body = this.payload();
    const id = this.data?.cliente?.id;
    const req$ = id
      ? this.clienteService.actualizarCliente(id, { ...body, clienteCodigoubigeo: body.clienteDistrito })
      : this.clienteService.registrarCliente({ ...body, clienteCodigoubigeo: body.clienteDistrito });

    req$.subscribe({
      next: (r: any) => this.dialogRef.close(r),
      error: e => console.error(e),
    });
  }

  cerrar() {
    this.dialogRef.close();
  }
}
