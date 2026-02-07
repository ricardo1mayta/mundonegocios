import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import { RequerimientoDTO } from '../../../../../../core/models/fabricacion/fabricacion.models';
import { FabricacionApi } from '../../../../../../core/services/fabricacion/fabricacion.api';

@Component({
  selector: 'app-requerimientos',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatInputModule,
    MatIconModule,
    MatNativeDateModule,
  ],
  templateUrl: './requerimientos.component.html',
  styleUrls: ['./requerimientos.component.css'],
})
export class RequerimientosComponent {
  private api = inject(FabricacionApi);
  private fb = inject(FormBuilder);

  loading = signal(false);
  created = signal<RequerimientoDTO | null>(null);

  form = this.fb.group({
    idCliente: [null as any],
    contacto: [''],
    descripcion: ['', Validators.required],
    colores: [''],
    tallas: [''],
    cantidadTotal: [0],
    fechaRequerida: [''],
    presupuestoObjetivo: [null as any],
  });

  crear() {
    this.loading.set(true);
    this.api.crearRequerimiento(this.form.getRawValue() as any).subscribe({
      next: r => {
        this.created.set(r);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}



