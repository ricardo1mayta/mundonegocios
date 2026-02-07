import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ImeisService } from '../../../../core/services/imeis/imeis.service';

@Component({
  selector: 'app-consultar-imei',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './consultar-imei.component.html',
  styleUrl: './consultar-imei.component.css',
})
export class ConsultarImeiComponent {
  private imeisService = inject(ImeisService);

  imei = '';
  cargando = false;
  error: string | null = null;
  resultado: any | null = null;

  buscar() {
    const value = this.imei.trim();
    this.error = null;
    this.resultado = null;

    if (!value) {
      this.error = 'Ingrese un IMEI.';
      return;
    }

    if (!/^\d{14,17}$/.test(value)) {
      this.error = 'IMEI inv?lido. Debe contener solo n?meros (14 a 17 d?gitos).';
      return;
    }

    this.cargando = true;
    this.imeisService.consultarImei(value).subscribe({
      next: (res: any) => {
        this.resultado = res?.data ?? res ?? null;
        if (!this.resultado) {
          this.error = 'IMEI no encontrado.';
        }
        this.cargando = false;
      },
      error: () => {
        this.error = 'No se pudo consultar el IMEI.';
        this.cargando = false;
      },
    });
  }

  limpiar() {
    this.imei = '';
    this.error = null;
    this.resultado = null;
  }
}
