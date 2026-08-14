import { CommonModule } from "@angular/common";
import { Component, Inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatInputModule } from "@angular/material/input";
import { SedesService } from "../../../core/services/sedes/sedes.service";
import { PrimeNgModule } from 'src/app/core/modules/primeng/primeng.module';

@Component({
  selector: "app-super-admin-sede-padre-basic-dialog",
  standalone: true,
  imports: [PrimeNgModule, CommonModule, FormsModule, MatDialogModule, MatDatepickerModule, MatNativeDateModule, MatInputModule],
  templateUrl: "./super-admin-sede-padre-basic-dialog.component.html",
})
export class SuperAdminSedePadreBasicDialogComponent {
  sede: any;

  constructor(
    private dialogRef: MatDialogRef<SuperAdminSedePadreBasicDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
    private sedesService: SedesService,
  ) {
    this.sede = { ...data };
    if (this.sede?.vigencia) {
      this.sede.vigencia = new Date(this.sede.vigencia);
    }
  }

  private formatDate(d: Date): string {
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }

  cerrar() {
    this.dialogRef.close(false);
  }

  guardar() {
    const payload = {
      nombressede: this.sede.nombressede,
      statusssede: this.sede.statusssede,
      vigencia: this.sede.vigencia ? this.formatDate(this.sede.vigencia) : null,
    };

    this.sedesService.editarSedePadre(this.sede.id, payload as any).subscribe({
      next: () => this.dialogRef.close(true),
      error: () => this.dialogRef.close(false),
    });
  }
}
