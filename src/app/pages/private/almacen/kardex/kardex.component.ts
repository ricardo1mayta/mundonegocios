import { CommonModule } from "@angular/common";
import { Component, computed, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AuthService } from "src/app/core/services/auth.service";
import { RutaService } from "src/app/core/services/general/ruta.service";
import { KardexService } from "../../../../core/services/kardex/kardex.service";
import { SedesService } from "../../../../core/services/sedes/sedes.service";

@Component({
  selector: "app-kardex",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./kardex.component.html",
  styleUrl: "./kardex.component.css",
})
export class KardexComponent {
  private readonly kardexService = inject(KardexService);
  private readonly sedesService = inject(SedesService);
  private readonly authService = inject(AuthService);
  private readonly rutaService = inject(RutaService);

  sedes = signal<any[]>([]);

  desde = signal(this.formatDate(this.firstDayOfMonth()));
  hasta = signal(this.formatDate(new Date()));
  idsede = signal<number>(10);
  idpro = signal<number | null>(null);

  iddet = signal<number | null>(null);
  productoId = signal<number | null>(null);
  productoSede = signal<number>(10);
  referencia = signal("PEDIDO");
  idReferencia = signal<number | null>(null);

  rangeRows = signal<any[]>([]);
  detalleRows = signal<any[]>([]);
  productoRows = signal<any[]>([]);
  documentoRows = signal<any[]>([]);

  rangeLoading = signal(false);
  detalleLoading = signal(false);
  productoLoading = signal(false);
  documentoLoading = signal(false);

  rangeError = signal<string | null>(null);
  detalleError = signal<string | null>(null);
  productoError = signal<string | null>(null);
  documentoError = signal<string | null>(null);

  rangeColumns = computed(() => this.columnsFor(this.rangeRows()));
  detalleColumns = computed(() => this.columnsFor(this.detalleRows()));
  productoColumns = computed(() => this.columnsFor(this.productoRows()));
  documentoColumns = computed(() => this.columnsFor(this.documentoRows()));

  ngOnInit(): void {
    this.rutaService.setPermisosRuta({
      puedeCrear: false,
      puedeExportar: false,
    });
    this.cargarSedes();
  }

  buscarRango(): void {
    const desde = this.desde();
    const hasta = this.hasta();

    if (!desde || !hasta) {
      this.rangeError.set("Debes ingresar un rango de fechas valido.");
      this.rangeRows.set([]);
      return;
    }

    this.rangeLoading.set(true);
    this.rangeError.set(null);

    this.kardexService
      .getPorRango({
        desde,
        hasta,
        idsede: this.idsede(),
        idpro: this.idpro(),
      })
      .subscribe({
        next: (res: any) => {
          this.rangeRows.set(this.normalizeRows(res));
          this.rangeLoading.set(false);
        },
        error: () => {
          this.rangeError.set("No se pudo cargar el kardex por rango.");
          this.rangeRows.set([]);
          this.rangeLoading.set(false);
        },
      });
  }

  buscarPorDetalle(): void {
    const iddet = this.iddet();
    if (!iddet) {
      this.detalleError.set("Ingresa un iddet valido.");
      this.detalleRows.set([]);
      return;
    }

    this.detalleLoading.set(true);
    this.detalleError.set(null);

    this.kardexService.getPorDetalle(iddet).subscribe({
      next: (res: any) => {
        this.detalleRows.set(this.normalizeRows(res));
        this.detalleLoading.set(false);
      },
      error: () => {
        this.detalleError.set("No se pudo cargar el kardex por detalle.");
        this.detalleRows.set([]);
        this.detalleLoading.set(false);
      },
    });
  }

  buscarPorProducto(): void {
    const idpro = this.productoId();
    if (!idpro) {
      this.productoError.set("Ingresa un id de producto valido.");
      this.productoRows.set([]);
      return;
    }

    this.productoLoading.set(true);
    this.productoError.set(null);

    this.kardexService.getPorProducto(idpro, this.productoSede()).subscribe({
      next: (res: any) => {
        this.productoRows.set(this.normalizeRows(res));
        this.productoLoading.set(false);
      },
      error: () => {
        this.productoError.set("No se pudo cargar el kardex por producto.");
        this.productoRows.set([]);
        this.productoLoading.set(false);
      },
    });
  }

  buscarPorDocumento(): void {
    const referencia = this.referencia().trim();
    const idReferencia = this.idReferencia();

    if (!referencia || !idReferencia) {
      this.documentoError.set("Ingresa la referencia y el id del documento.");
      this.documentoRows.set([]);
      return;
    }

    this.documentoLoading.set(true);
    this.documentoError.set(null);

    this.kardexService.getPorDocumento(referencia, idReferencia).subscribe({
      next: (res: any) => {
        this.documentoRows.set(this.normalizeRows(res));
        this.documentoLoading.set(false);
      },
      error: () => {
        this.documentoError.set("No se pudo cargar el kardex por documento.");
        this.documentoRows.set([]);
        this.documentoLoading.set(false);
      },
    });
  }

  columnsFor(rows: any[]): string[] {
    const first = rows[0];
    if (!first || typeof first !== "object") {
      return [];
    }

    return Object.keys(first).filter((key) => typeof first[key] !== "object");
  }

  formatCell(value: any): string {
    if (value == null || value === "") {
      return "-";
    }

    if (typeof value === "boolean") {
      return value ? "Si" : "No";
    }

    if (typeof value === "object") {
      return JSON.stringify(value);
    }

    return String(value);
  }

  labelFor(key: string): string {
    return key
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/_/g, " ")
      .replace(/^./, (text) => text.toUpperCase());
  }

  hasRows(rows: any[]): boolean {
    return rows.length > 0;
  }

  getSedeId(sede: any): number | null {
    const value = sede?.id ?? sede?.idsede ?? sede?.idSede ?? null;
    const id = Number(value);
    return Number.isFinite(id) ? id : null;
  }

  getSedeNombre(sede: any): string {
    return String(sede?.nombre ?? sede?.nombresede ?? sede?.descripcion ?? "").trim();
  }

  private normalizeRows(res: any): any[] {
    const root = res?.data ?? res ?? null;

    if (Array.isArray(root)) {
      return root;
    }

    if (Array.isArray(root?.lista)) {
      return root.lista;
    }

    if (Array.isArray(root?.content)) {
      return root.content;
    }

    if (Array.isArray(root?.items)) {
      return root.items;
    }

    if (root && typeof root === "object") {
      return [root];
    }

    return [];
  }

  private cargarSedes(): void {
    this.sedesService.obtenerTodasLasSedesLista().subscribe({
      next: (res: any) => {
        const data = res?.data ?? res ?? [];
        const sedes = Array.isArray(data) ? data : [];
        this.sedes.set(sedes);
        this.seleccionarSedeInicial(sedes);
        this.buscarRango();
      },
      error: () => {
        this.sedes.set([]);
        this.buscarRango();
      },
    });
  }

  private seleccionarSedeInicial(sedes: any[]): void {
    if (!sedes.length) {
      return;
    }

    const nombreContexto = String(this.authService.nombresede() ?? "").trim().toLocaleLowerCase();
    const sedeSeleccionada = sedes.find((sede) => this.getSedeNombre(sede).toLocaleLowerCase() === nombreContexto) ?? sedes[0];
    const selectedId = this.getSedeId(sedeSeleccionada);

    if (selectedId == null) {
      return;
    }

    this.idsede.set(selectedId);
    this.productoSede.set(selectedId);
  }

  private firstDayOfMonth(): Date {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  }

  private formatDate(date: Date): string {
    const pad = (value: number) => String(value).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  }
}