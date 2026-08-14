import { Component, inject, model, signal, viewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, Validators, ReactiveFormsModule, FormsModule, FormControl, FormGroup } from "@angular/forms";
import { InsumoDTO } from "../../../../../../core/models/fabricacion/fabricacion.models";
import { InsumoService } from "../../../../../../core/services/insumo/insumo.service";
import { MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { DataTableModule } from "../../../../../../core/components/data-table/data-table.module";
import { FormCrudComponent } from "../../../../../../core/components/form-crud/form-crud.component";
import { FormFilterComponent } from "../../../../../../core/components/form-crud/form-filter/form-filter.component";
import { FormListComponent } from "../../../../../../core/components/form-crud/form-list/form-list.component";
import { MaterialModule } from "../../../../../../core/modules/material/material.module";
import { DataTableComponent } from "../../../../../../core/components/data-table/data-table.component";
import { CrearInsumosComponent } from "../crear-insumos/crear-insumos.component";
import { MatDialog } from "@angular/material/dialog";
@Component({
  selector: "app-insumos",
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormFilterComponent,
    FormListComponent,
    DataTableModule,
    ReactiveFormsModule,
  ],

  templateUrl: "./insumos.component.html",
  styleUrls: ["./insumos.component.css"],
})
export class InsumosComponent {
  private fb = inject(FormBuilder);
  private api = inject(InsumoService);
  urlApi = signal("");
  filtros = model<any>();
  filtroForm = new FormGroup({
    buscador: new FormControl(),
    fechaDesde: new FormControl(),
    fechaHasta: new FormControl(),
  });
  // filtros (ngModel)
  q = "";
  tipo = "";

  page = signal(0);
  size = signal(10);
  totalPages = signal(1);
  items = signal<InsumoDTO[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  dataTable = viewChild(DataTableComponent);
  form = this.fb.group({
    tipo: ["MATERIA_PRIMA", Validators.required],
    nombre: ["", Validators.required],
    unidadCompra: [""],
    unidadConsumo: [""],
    factorConversion: [null as any],
    costoUnitCompra: [0, Validators.required],
  });

  constructor(private dialog: MatDialog) {
    this.buscar();
    this.urlApi = signal(this.api.urlInsumoService);
  }
  aplicarFiltros(): void {
    const { buscador, fechaDesde, fechaHasta } = this.filtroForm.getRawValue();
    this.filtros.set({
      buscador: buscador?.trim() || null,
    });
    this.dataTable()?.recargarTabla(); // dispara la petición al backend
  }
  buscar() {}

  prev() {
    this.page.set(Math.max(0, this.page() - 1));
    this.buscar();
  }

  next() {
    if (this.page() + 1 >= this.totalPages()) return;
    this.page.set(this.page() + 1);
    this.buscar();
  }

  crear() {
    const ref = this.dialog.open(CrearInsumosComponent, {
      width: "80rem",
      maxWidth: "95vw",
      maxHeight: "90vh",
      disableClose: false,
      //data: { fichaId, bomId },
    });

    ref.afterClosed().subscribe((res: any) => {
      if (res?.refresh) {
        // recargar tabla
        // this.dataTable()?.recargarTabla();
      }
    });
  }
  editar(row: any) {
    const ref = this.dialog.open(CrearInsumosComponent, {
      width: "60rem",
      maxWidth: "95vw",
      disableClose: false,
      data: { insumoId: row.id }, // row.id es tu API
    });

    ref.afterClosed().subscribe((r: any) => {
      if (r?.refresh) this.dataTable()?.recargarTabla();
    });
  }
  insumo(e: any) {}
}


