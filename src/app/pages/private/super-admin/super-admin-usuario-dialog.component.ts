import { CommonModule } from "@angular/common";
import { Component, Inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { UsuarioService } from "../../../core/services/usuario/usuario.service";
import { MatSelectModule } from "@angular/material/select";
import { Rol } from "src/app/core/models/roles/rol";
import { RolesService } from "src/app/core/services/roles/roles.service";
import { MaterialModule } from "src/app/core/modules/material/material.module";

@Component({
  selector: "app-super-admin-usuario-dialog",
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MaterialModule, MatSelectModule],
  templateUrl: "./super-admin-usuario-dialog.component.html",
})
export class SuperAdminUsuarioDialogComponent {
  usuario: any;
  esNuevo = false;
  sedeHijaId: number | null = null;
  roles: Rol[] = [];
  constructor(
    private dialogRef: MatDialogRef<SuperAdminUsuarioDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
    private usuariosService: UsuarioService,
    private rolesService: RolesService,
  ) {
    this.esNuevo = data?.__modo === "nuevo" || !data?.idUser;
    this.sedeHijaId = data?.sedeHijaId ?? null;
    const rolesIds = Array.isArray(data?.roles)
      ? data.roles.map((r: any) => r.idRol)
      : Array.isArray(data?.rolesIds)
        ? data.rolesIds
        : [];

    this.usuario = this.esNuevo
      ? {
          username: "",
          password: "",
          emailUser: "",
          activo: true,
          tipoUser: "EXT",
          idcodTipoUser: 0,

          apellidos: "",
          rolesIds: [] as number[],
        }
      : {
          ...data,
          rolesIds,
        };
    this.rolesService.obtenerTodosLosRoles().subscribe((r: any) => (this.roles = r.data as Rol[]));
  }

  guardar() {
    const rolesIds = Array.isArray(this.usuario.rolesIds)
      ? this.usuario.rolesIds.map((x: any) => Number(x)).filter((x: number) => Number.isFinite(x))
      : [];

    const payload: any = {
      username: this.usuario.username,
      password: this.usuario.password,
      emailUser: this.usuario.emailUser,
      activo: this.usuario.activo,
      tipoUser: this.usuario.tipoUser,
      idcodTipoUser: this.usuario.idcodTipoUser,
      rolesIds,
      apellidos: this.usuario.apellidos,
      sedeId: this.sedeHijaId,
    };

    if (this.esNuevo) {
      this.usuariosService.crearUsuario(payload).subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: () => {
          this.dialogRef.close(false);
        },
      });
      return;
    }

    if (!this.usuario.password) {
      delete payload.password;
    }
    const id = this.usuario.idUser ?? this.usuario.id;
    if (!id) {
      this.dialogRef.close(false);
      return;
    }
    this.usuariosService.editarUsuario(id, payload).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: () => {
        this.dialogRef.close(false);
      },
    });
  }
}
