import { Component, computed, inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { PrimeNgModule } from "../../modules/primeng/primeng.module";
import { IConfiguracionModal } from "../../models/modal/modal.models";

@Component({
  selector: "app-modal",
  standalone: true,
  imports: [PrimeNgModule],
  templateUrl: "./modal.component.html",
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
    return this.data.tipo === "warning" || this.data.tipo === "question" ? "Sí" : "Aceptar";
  });

  mostrarNo = computed(() => {
    if (this.data.mostrarNo === true || this.data.mostrarAceptar === false) {
      return this.data.mostrarNo;
    }
    return this.data.tipo === "warning" || this.data.tipo === "question";
  });

  textoNo = computed(() => {
    if (this.data.textoNo) {
      return this.data.textoNo;
    }
    return "No";
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
    return "Cancelar";
  });

  iconClass = computed(() => {
    const icons: Record<string, string> = {
      info: "pi pi-info-circle text-blue-500",
      error: "pi pi-times-circle text-red-500",
      warning: "pi pi-exclamation-triangle text-yellow-500",
      question: "pi pi-question-circle text-blue-500",
      success: "pi pi-check-circle text-green-500",
    };
    return icons[this.data.tipo ?? "info"] ?? "pi pi-info-circle text-blue-500";
  });
}
