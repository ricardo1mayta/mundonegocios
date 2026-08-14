import { CommonModule } from "@angular/common";
import { Component, Inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { SedesService } from "../../../core/services/sedes/sedes.service";

@Component({
  selector: "app-super-admin-sede-hija-dialog",
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: "./super-admin-sede-hija-dialog.component.html",
})
export class SuperAdminSedeHijaDialogComponent {
  sede: any;
  sedePadreId: number | null = null;
  esNuevo = false;

  constructor(
    private dialogRef: MatDialogRef<SuperAdminSedeHijaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
    private sedesService: SedesService
  ) {
    this.esNuevo = data?.__modo === "nuevo" || !data?.id;
    this.sedePadreId = data?.sedePadreId ?? null;
    this.sede = this.esNuevo
      ? {
          ruc: "",
          tipoDoc: "6",
          nomComercial: "",
          razonSocial: "",
          direccion: "",
          telefono: "",
          codigoUbigeo: "",
          nombresede: "",
          status: true,
        }
      : { ...data };
  }

  guardar() {
    if (this.esNuevo) {
      const payload = {
        ruc: this.sede.ruc,
        tipoDoc: this.sede.tipoDoc,
        nomComercial: this.sede.nomComercial,
        razonSocial: this.sede.razonSocial,
        codigoUbigeo: this.sede.codigoUbigeo,
        telefono: this.sede.telefono,
        nombresede: this.sede.nombresede,
        idpadre: this.sedePadreId,
        parent: this.sedePadreId,
      };
      if (!this.sedePadreId) {
        this.dialogRef.close(false);
        return;
      }
      this.sedesService.crearSede(payload as any).subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: () => {
          this.dialogRef.close(false);
        },
      });
      return;
    }

    const payload = {
      ruc: this.sede.ruc,
      tipoDoc: this.sede.tipoDoc,
      nomComercial: this.sede.nomComercial,
      razonSocial: this.sede.razonSocial,
      direccion: this.sede.direccion,
      telefono: this.sede.telefono,
      codigoUbigeo: this.sede.codigoUbigeo,
      nombresede: this.sede.nombresede,
      status: this.sede.status,
      idpadre: this.sedePadreId,
      parent: this.sedePadreId,
    };
    this.sedesService.editarSede(this.sede.id, payload as any).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: () => {
        this.dialogRef.close(false);
      },
    });
  }
}