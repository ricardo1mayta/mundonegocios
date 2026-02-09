import { CommonModule } from "@angular/common";
import { Component, Inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { SedesService } from "../../../core/services/sedes/sedes.service";

@Component({
  selector: "app-super-admin-sede-padre-dialog",
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: "./super-admin-sede-padre-dialog.component.html",
})
export class SuperAdminSedePadreDialogComponent {
  sede: any;

  constructor(
    private dialogRef: MatDialogRef<SuperAdminSedePadreDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
    private sedesService: SedesService,
  ) {
    this.sede = { ...data };
  }

  guardar() {
    const payload = {
      nombre: this.sede.nombressede,
      correo: this.sede.correo,
      clave: this.sede.clave,
    };
    this.sedesService.crearSedePadre(payload as any).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: () => {
        this.dialogRef.close(false);
      },
    });
  }
}
