import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { NumeracionService } from "../../../core/services/numeracion/numeracion.service";
import { SedesService } from "../../../core/services/sedes/sedes.service";

@Component({
  selector: "app-numeracion",
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: "./numeracion.component.html",
  styleUrl: "./numeracion.component.css",
})
export class NumeracionComponent {
  private numeracionService = inject(NumeracionService);
  private sedesService = inject(SedesService);

  idSede: number | null = null;
  sedes: any[] = [];
  cargando = false;
  error: string | null = null;

  lista: any[] = [];
  editingId: number | null = null;

  tipo = "G";
  serie = "T001";
  numero: number | null = 0;
  estado = true;
  descripcion = "";

  ngOnInit(): void {
    this.cargarSedes();
  }

  private cargarSedes() {
    this.sedesService.listarSedesHijas().subscribe({
      next: (res: any) => {
        const data = res?.data ?? res ?? [];
        this.sedes = Array.isArray(data) ? data : [];
        if (!this.idSede && this.sedes.length) {
          this.idSede = this.sedes[0]?.id ?? null;
          this.cargar();
        }
      },
      error: () => {
        this.error = "No se pudieron cargar las sedes.";
      },
    });
  }

  cargar() {
    if (!this.idSede) {
      this.error = "Ingrese id de sede.";
      return;
    }
    this.cargando = true;
    this.error = null;
    this.numeracionService.listarPorSede(this.idSede).subscribe({
      next: (res: any) => {
        const data = res?.data ?? res ?? [];
        this.lista = Array.isArray(data) ? data : [];
        this.cargando = false;
      },
      error: () => {
        this.error = "No se pudo cargar la numeración.";
        this.cargando = false;
      },
    });
  }

  guardar() {
    this.error = null;
    const payload = {
      idSede: this.idSede,
      tipo: this.tipo,
      serie: this.serie,
      numero: Number(this.numero ?? 0),
      estado: this.estado,
      descripcion: this.descripcion,
    };

    const req$ = this.editingId ? this.numeracionService.actualizar(this.editingId, payload) : this.numeracionService.crear(payload);
    req$.subscribe({
      next: (res: any) => {
        const status = res?.status ?? res?.body?.status?.code ?? res?.body?.status;
        if (status === 201 || status === 200) {
          this.limpiar();
          this.cargar();
        }
      },
      error: () => {
        this.error = this.editingId ? "No se pudo actualizar." : "No se pudo crear.";
      },
    });
  }

  editar(id: number) {
    this.error = null;
    this.numeracionService.obtener(id).subscribe({
      next: (res: any) => {
        const data = res?.data ?? res;
        if (!data) return;
        this.editingId = data.id ?? id;
        this.tipo = data.tipo ?? this.tipo;
        this.serie = data.serie ?? this.serie;
        this.numero = data.numero ?? 0;
        this.estado = data.estado ?? true;
        this.descripcion = data.descripcion ?? "";
      },
      error: () => {
        this.error = "No se pudo cargar el detalle.";
      },
    });
  }

  eliminar(id: number) {
    this.error = null;
    this.numeracionService.eliminar(id).subscribe({
      next: (res: any) => {
        const status = res?.status ?? res?.body?.status?.code ?? res?.body?.status;
        if (status === 200) {
          this.cargar();
        }
      },
      error: () => {
        this.error = "No se pudo eliminar.";
      },
    });
  }

  limpiar() {
    this.editingId = null;
    this.tipo = "G";
    this.serie = "T001";
    this.numero = 0;
    this.estado = true;
    this.descripcion = "";
  }
}
