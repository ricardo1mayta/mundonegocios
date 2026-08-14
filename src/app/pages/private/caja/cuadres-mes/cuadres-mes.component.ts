import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatInputModule } from "@angular/material/input";
import { CuadreDiarioService } from "../../../../core/services/cuadre-diario/cuadre-diario.service";
import { PrimeNgModule } from 'src/app/core/modules/primeng/primeng.module';

@Component({
  selector: "app-cuadres-mes",
  standalone: true,
  imports: [PrimeNgModule, CommonModule, FormsModule, MatDatepickerModule, MatNativeDateModule, MatInputModule],
  templateUrl: "./cuadres-mes.component.html",
  styleUrl: "./cuadres-mes.component.css",
})
export class CuadresMesComponent {
  private cuadreService = inject(CuadreDiarioService);

  desde = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  hasta = new Date();

  cargando = false;
  error: string | null = null;
  lista: any[] = [];

  ngOnInit(): void {
    this.cargar();
  }

  private formatDate(d: Date): string {
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }

  cargar() {
    this.cargando = true;
    this.error = null;
    this.cuadreService.listarRango(this.formatDate(this.desde), this.formatDate(this.hasta)).subscribe({
      next: (res: any) => {
        const data = res?.data ?? res ?? [];
        this.lista = Array.isArray(data) ? data : [];
        this.cargando = false;
      },
      error: () => {
        this.error = "No se pudieron cargar los cuadres.";
        this.cargando = false;
      },
    });
  }

  get totalVentas(): number {
    return this.lista.reduce((s, r) => s + (Number(r?.ventasTotal) || 0), 0);
  }

  get totalCompras(): number {
    return this.lista.reduce((s, r) => s + (Number(r?.comprasTotal) || 0), 0);
  }

  get totalGastos(): number {
    return this.lista.reduce((s, r) => s + (Number(r?.gastosTotal) || 0), 0);
  }

  get totalMercaderia(): number {
    return this.lista.reduce((s, r) => s + (Number(r?.mercaderia) || 0), 0);
  }

  get totalDiferencia(): number {
    return this.lista.reduce((s, r) => s + (Number(r?.diferencia) || 0), 0);
  }
}