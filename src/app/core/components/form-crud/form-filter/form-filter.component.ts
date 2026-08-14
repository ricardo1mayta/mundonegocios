import { CommonModule } from "@angular/common";
import { Component, input, model, OnInit } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { PrimeNgModule } from "../../../modules/primeng/primeng.module";

@Component({
  selector: "app-form-filter",
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, PrimeNgModule],
  templateUrl: "./form-filter.component.html",
  styleUrl: "./form-filter.component.scss",
})
export class FormFilterComponent implements OnInit {
  formGroup = input.required<FormGroup>();
  filtros = model.required<any>();
  propiedadActivo = input<string>("indEstado");
  tituloEstado = input<string>("Estado");
  etiquetaActivo = input<string>("Activo");
  etiquetaInactivo = input<string>("Inactivo");
  checkActivo = new FormControl<boolean>(false);
  checkInactivo = new FormControl<boolean>(false);
  mostrarEstado = input(true);
  valorCheckActivo = input<any>(true);
  valorCheckInactivo = input<any>(false);

  ngOnInit() {
    this.filtrosIniciales();
  }

  filtrosIniciales() {
    if (this.checkActivo.value) {
      this.filtros.set({ [this.propiedadActivo()]: true });
    } else if (this.checkInactivo.value) {
      this.filtros.set({ [this.propiedadActivo()]: false });
    } else {
      this.filtros.set({});
    }
  }

  checkChange(itemIndex: number) {
    if (itemIndex === 1 && this.checkActivo.value && this.checkInactivo.value) {
      this.checkInactivo.setValue(false);
    } else if (itemIndex === 2 && this.checkInactivo.value && this.checkActivo.value) {
      this.checkActivo.setValue(false);
    }
  }

  buscarClick() {
    this.formGroup().markAllAsTouched();
    this.formGroup().updateValueAndValidity();

    if (this.formGroup().invalid) {
      return;
    }

    const values: any = this.formGroup().value;
    const filtrosFinales = { ...values };

    if (this.mostrarEstado()) {
      const estadoValue = this.checkActivo.value
        ? this.valorCheckActivo()
        : this.checkInactivo.value
          ? this.valorCheckInactivo()
          : null;

      if (estadoValue !== null) {
        filtrosFinales[this.propiedadActivo()] = estadoValue;
      }
    }

    this.filtros.set(filtrosFinales);
  }

  limpiarClick() {
    const form = this.formGroup();
    form.reset();
    this.checkActivo.setValue(false);
    this.checkInactivo.setValue(false);

    const fechaDesde = form.get("fechaDesde");
    const fechaHasta = form.get("fechaHasta");
    fechaDesde?.clearValidators();
    fechaHasta?.clearValidators();
    fechaDesde?.updateValueAndValidity();
    fechaHasta?.updateValueAndValidity();

    this.filtrosIniciales();
  }
}