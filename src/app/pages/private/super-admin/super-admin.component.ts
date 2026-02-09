import { CommonModule } from "@angular/common";
import { Component, ViewChild, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { SuperAdminService } from "../../../core/services/super-admin/super-admin.service";
import { SuperAdminSedePadreBasicDialogComponent } from "./super-admin-sede-padre-basic-dialog.component";
import { SuperAdminSedePadreDialogComponent } from "./super-admin-sede-padre-dialog.component";
import { SuperAdminSedeHijaDialogComponent } from "./super-admin-sede-hija-dialog.component";
import { SuperAdminUsuarioDialogComponent } from "./super-admin-usuario-dialog.component";
import { DataTableComponent } from "../../../core/components/data-table/data-table.component";
import { DataTableModule } from "../../../core/components/data-table/data-table.module";

@Component({
  selector: "app-super-admin",
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, DataTableModule],
  templateUrl: "./super-admin.component.html",
  styleUrl: "./super-admin.component.css",
})
export class SuperAdminComponent {
  readonly api = inject(SuperAdminService);
  private dialog = inject(MatDialog);

  @ViewChild("tablaPadre")
  dataTablePadre!: DataTableComponent;

  @ViewChild("tablaHijas")
  dataTableHijas!: DataTableComponent;

  @ViewChild("tablaUsuarios")
  dataTableUsuarios!: DataTableComponent;

  parametrosPadres: any = {};
  parametrosHijas: any = null;
  parametrosUsuarios: any = null;
  sedePadreSel: any | null = null;
  sedesHijas: any[] = [];
  sedePadreId: number | null = null;
  sedeHijaId: number | null = null;

  cargandoHijas = false;
  error: string | null = null;

  ngOnInit(): void {}

  seleccionarSedePadre(s: any) {
    if (!s) return;
    this.sedePadreSel = s;
    this.sedePadreId = s.id ?? null;
    const dialogRef = this.dialog.open(SuperAdminSedePadreBasicDialogComponent, {
      width: "60rem",
      maxWidth: "95vw",
      data: s,
    });
    dialogRef.afterClosed().subscribe((ok: boolean) => {
      if (ok && this.dataTablePadre) this.dataTablePadre.recargarTabla(0);
    });
  }

  crearSedePadre() {
    const dialogRef = this.dialog.open(SuperAdminSedePadreDialogComponent, {
      width: "60rem",
      maxWidth: "95vw",
      data: { __modo: "nuevo" },
    });
    dialogRef.afterClosed().subscribe((ok: boolean) => {
      if (ok && this.dataTablePadre) this.dataTablePadre.recargarTabla(0);
    });
  }

  verHijas(s: any) {
    if (!s) return;
    const nextId = s.id ?? 0;
    const sameId = this.sedePadreId === nextId;
    this.sedePadreSel = s;
    this.sedePadreId = nextId;
    this.sedeHijaId = 0;
    this.parametrosHijas = { idSedePadre: this.sedePadreId };
    // Evita doble fetch si el click dispara el evento dos veces
    if (this.cargandoHijas && sameId) return;
    this.cargarHijas();
  }

  cargarHijas() {
    if (!this.sedePadreId) return;
    this.cargandoHijas = true;
    this.error = null;
    this.api.listarSedesHijas(this.sedePadreId).subscribe({
      next: (res: any) => {
        const data = res?.data ?? res ?? [];
        this.sedesHijas = Array.isArray(data) ? data : [];
        this.cargandoHijas = false;
        if (this.sedesHijas.length) {
          this.sedeHijaId = this.sedesHijas[0]?.id ?? null;
          this.parametrosUsuarios = { idSede: this.sedeHijaId };
          if (this.dataTableUsuarios) this.dataTableUsuarios.recargarTabla(0);
        } else {
          this.sedeHijaId = null;
          this.parametrosUsuarios = null;
        }
      },
      error: () => {
        this.error = "No se pudieron cargar las sedes hijas.";
        this.cargandoHijas = false;
      },
    });
  }

  editarSedeHija(s: any) {
    if (!s) return;
    const dialogRef = this.dialog.open(SuperAdminSedeHijaDialogComponent, {
      width: "60rem",
      maxWidth: "95vw",
      data: s,
    });
    dialogRef.afterClosed().subscribe((ok: boolean) => {
      if (ok && this.dataTableHijas) this.dataTableHijas.recargarTabla(0);
    });
  }

  crearSedeHija() {
    if (!this.sedePadreId) {
      this.error = "Selecciona una sede padre antes de crear una sede hija.";
      return;
    }
    const dialogRef = this.dialog.open(SuperAdminSedeHijaDialogComponent, {
      width: "60rem",
      maxWidth: "95vw",
      data: { __modo: "nuevo", sedePadreId: this.sedePadreId },
    });
    dialogRef.afterClosed().subscribe((ok: boolean) => {
      if (ok) {
        if (this.dataTableHijas) this.dataTableHijas.recargarTabla(0);
        this.cargarHijas();
      }
    });
  }

  abrirUsuarioNuevo() {
    if (!this.sedeHijaId) {
      this.error = "Selecciona una sede hija para crear el usuario.";
      return;
    }
    const dialogRef = this.dialog.open(SuperAdminUsuarioDialogComponent, {
      width: "60rem",
      maxWidth: "95vw",
      data: { __modo: "nuevo", sedeHijaId: this.sedeHijaId },
    });
    dialogRef.afterClosed().subscribe((ok: boolean) => {
      if (ok) {
        this.parametrosUsuarios = { idSede: this.sedeHijaId };
        if (this.dataTableUsuarios) this.dataTableUsuarios.recargarTabla(0);
      }
    });
  }

  editarUsuario(u: any) {
    if (!u) return;
    const dialogRef = this.dialog.open(SuperAdminUsuarioDialogComponent, {
      width: "60rem",
      maxWidth: "95vw",
      data: { ...u, __modo: "editar", sedeHijaId: this.sedeHijaId },
    });
    dialogRef.afterClosed().subscribe((ok: boolean) => {
      if (ok) {
        this.parametrosUsuarios = { idSede: this.sedeHijaId };
        if (this.dataTableUsuarios) this.dataTableUsuarios.recargarTabla(0);
      }
    });
  }

  cambiarSedeUsuario() {
    this.parametrosUsuarios = { idSede: this.sedeHijaId };
    if (this.dataTableUsuarios) this.dataTableUsuarios.recargarTabla(0);
  }

  onSedeHijaSelect(value: string) {
    const next = Number(value);
    this.sedeHijaId = Number.isFinite(next) ? next : null;
    this.cambiarSedeUsuario();
  }
}
