import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { IConfiguracionModal } from '../../models/modal/modal.models';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [MatButtonModule, MatDialogContent, MatDialogActions, MatDialogClose, MatIconModule],
  templateUrl: './modal.component.html',
})
export class ModalComponent {
  readonly data = inject<IConfiguracionModal>(MAT_DIALOG_DATA);

  mostrarAceptar = computed(() => {
    if (this.data.mostrarAceptar === true || this.data.mostrarAceptar === false) {
      return this.data.mostrarAceptar;
    }
    return true;
  });

  textoAceptar = computed(() => {
    if (this.data.textoAceptar) {
      return this.data.textoAceptar;
    }
    return this.data.tipo === 'warning' || this.data.tipo === 'question' ? 'Sí' : 'Aceptar';
  });

  mostrarNo = computed(() => {
    if (this.data.mostrarNo === true || this.data.mostrarAceptar === false) {
      return this.data.mostrarNo;
    }
    return this.data.tipo === 'warning' || this.data.tipo === 'question';
  });

  textoNo = computed(() => {
    if (this.data.textoNo) {
      return this.data.textoNo;
    }
    return 'No';
  });

  mostrarCancelar = computed(() => {
    if (this.data.mostrarCancelar === true || this.data.mostrarAceptar === false) {
      return this.data.mostrarCancelar;
    }
    return false;
  });

  textoCancelar = computed(() => {
    if (this.data.textoCancelar) {
      return this.data.textoCancelar;
    }
    return 'Cancelar';
  });
}
