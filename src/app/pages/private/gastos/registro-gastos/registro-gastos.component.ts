import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { GastosService } from "../../../../core/services/gastos/gastos.service";
import { PrimeNgModule } from 'src/app/core/modules/primeng/primeng.module';

@Component({
  selector: "app-registro-gastos",
  standalone: true,
  imports: [PrimeNgModule, CommonModule, FormsModule, MatDatepickerModule, MatNativeDateModule, MatInputModule, MatIconModule],
  templateUrl: "./registro-gastos.component.html",
  styleUrl: "./registro-gastos.component.css",
})
export class RegistroGastosComponent {
  private gastosService = inject(GastosService);

  fecha = new Date();
  monto: number | null = null;
  descripcion = "";
  error: string | null = null;
  cargando = false;

  gastos: any[] = [];
  detalleMap: Record<number, any> = {};
  editingId: number | null = null;

  ngOnInit(): void {
    this.cargarLista();
  }

  onFechaChange() {
    this.cargarLista();
  }

  private formatDate(d: Date): string {
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }

  guardar() {
    this.error = null;
    const fecha = this.formatDate(this.fecha);
    const descripcion = (this.descripcion || "").trim();
    const monto = Number(this.monto);

    if (!fecha) {
      this.error = "Ingrese una fecha.";
      return;
    }
    if (!descripcion) {
      this.error = "Ingrese una descripción.";
      return;
    }
    if (!monto || monto <= 0) {
      this.error = "Ingrese un monto válido.";
      return;
    }

    const payload = { fecha, monto, descripcion };

    const req$ = this.editingId ? this.gastosService.actualizar(this.editingId, payload) : this.gastosService.crear(payload);
    req$.subscribe({
      next: (res: any) => {
        const status = res?.status ?? res?.body?.status?.code ?? res?.body?.status;
        if (status === 201 || status === 200) {
          this.cancelarEdicion();
          this.cargarLista();
        }
      },
      error: () => {
        this.error = this.editingId ? "No se pudo actualizar el gasto." : "No se pudo guardar el gasto.";
      },
    });
  }

  editar(id: number) {
    this.error = null;
    this.gastosService.obtenerDetalle(id).subscribe({
      next: (res: any) => {
        const data = res?.data ?? res;
        if (!data) return;
        this.detalleMap[id] = data;
        this.editingId = id;
        this.fecha = data?.fecha ?? this.fecha;
        this.monto = data?.monto ?? null;
        this.descripcion = data?.descripcion ?? "";
      },
      error: () => {
        this.error = "No se pudo cargar el detalle del gasto.";
      },
    });
  }

  cancelarEdicion() {
    this.editingId = null;
    this.monto = null;
    this.descripcion = "";
  }

  eliminar(id: number) {
    this.error = null;
    this.gastosService.eliminar(id).subscribe({
      next: (res: any) => {
        const status = res?.status ?? res?.body?.status?.code ?? res?.body?.status;
        if (status === 200) {
          this.cargarLista();
        }
      },
      error: () => {
        this.error = "No se pudo eliminar el gasto.";
      },
    });
  }

  private cargarLista() {
    this.cargando = true;
    this.error = null;
    this.gastosService.listarPorFecha(this.formatDate(this.fecha)).subscribe({
      next: (res: any) => {
        const data = res?.data ?? res ?? [];
        this.gastos = Array.isArray(data) ? data : [];
        this.cargando = false;
      },
      error: () => {
        this.error = "No se pudo cargar la lista de gastos.";
        this.cargando = false;
      },
    });
  }
}
