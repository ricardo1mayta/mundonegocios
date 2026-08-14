import { NgClass } from "@angular/common";
import { Component, input, signal } from "@angular/core";
import { PrimeNgModule } from "../../modules/primeng/primeng.module";

@Component({
  selector: "app-form-crud",
  standalone: true,
  imports: [NgClass, PrimeNgModule],
  templateUrl: "./form-crud.component.html",
  styleUrl: "./form-crud.component.scss",
})
export class FormCrudComponent {
  titulo = input.required<string>();
  tituloFiltros = input<string>("Filtros de Busqueda");
  mostrarFiltros = signal<boolean>(true);
  mensajeAdvertencia = input<string>();
}