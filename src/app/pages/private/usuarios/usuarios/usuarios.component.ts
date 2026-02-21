import { CommonModule } from "@angular/common";
import { Component, inject, model, signal, ViewChild } from "@angular/core";
import { ReactiveFormsModule, FormsModule, FormGroup, FormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { DataTableComponent } from "../../../../core/components/data-table/data-table.component";
import { IReporteExcel } from "../../../../core/components/data-table/data-table.model";
import { DataTableModule } from "../../../../core/components/data-table/data-table.module";
import { FormCrudComponent } from "../../../../core/components/form-crud/form-crud.component";
import { FormFilterComponent } from "../../../../core/components/form-crud/form-filter/form-filter.component";
import { FormListComponent } from "../../../../core/components/form-crud/form-list/form-list.component";
import { Usuario } from "../../../../core/models/usuario";
import { MaterialModule } from "../../../../core/modules/material/material.module";
import { NuevoUsuarioComponent } from "../nuevo-usuario/nuevo-usuario.component";
import { UsuarioService } from "../../../../core/services/usuario/usuario.service";
import { SwitchComponent } from "src/app/shared/components/form/input/switch.component";
import { RutaService } from "src/app/core/services/general/ruta.service";

@Component({
  selector: "app-usuarios",
  imports: [
    CommonModule,
    MaterialModule,
    FormCrudComponent,
    FormFilterComponent,
    FormListComponent,
    DataTableModule,
    ReactiveFormsModule,
    FormsModule,
    SwitchComponent,
  ],
  templateUrl: "./usuarios.component.html",
  styleUrl: "./usuarios.component.css",
})
export class UsuariosComponent {
  filtros = model<any>();

  filtroForm = new FormGroup({
    buscador: new FormControl(),
    activo: new FormControl<boolean | null>(null),
  });

  urlApi = signal("");

  @ViewChild(DataTableComponent)
  dataTable!: DataTableComponent;

  configuracionExcel: IReporteExcel = {
    titulo: "Lista de Usuarios",
    fuente: "Reporte de usuarios",
    columnas: [
      { titulo: "ID", propiedad: "idUser" },
      { titulo: "Username", propiedad: "username" },
      { titulo: "Correo", propiedad: "emailUser" },
      { titulo: "Activo", propiedad: "activo" },
      { titulo: "Tipo", propiedad: "tipoUser" },
      { titulo: "Nombres", propiedad: "nombres" },
      { titulo: "Apellidos", propiedad: "apellidos" },
    ],
  };
  private rutaService = inject(RutaService);
  constructor(
    private dialog: MatDialog,
    private usuariosService: UsuarioService,
  ) {}

  ngOnInit(): void {
    this.rutaService.setPermisosRuta({
      puedeCrear: true,
      puedeExportar: false,
    });
    this.urlApi = signal(this.usuariosService.urlListarUsuarios);
    this.buscar();
  }

  buscar(): void {
    this.dataTable?.recargarTabla();
  }

  crearUsuario(): void {
    const dialogRef = this.dialog.open(NuevoUsuarioComponent, {
      width: "80%",
    });
    dialogRef.afterClosed().subscribe((res: unknown) => res && this.buscar());
  }

  editarUsuario(usuario: Usuario): void {
    this.usuariosService.obtenerUsuario(usuario.idUser!).subscribe({
      next: (res: any) => {
        const data = res?.data ?? res ?? usuario;
        const dialogRef = this.dialog.open(NuevoUsuarioComponent, {
          width: "80%",
          data,
        });
        dialogRef.afterClosed().subscribe((result: unknown) => result && this.buscar());
      },
      error: () => {
        const dialogRef = this.dialog.open(NuevoUsuarioComponent, {
          width: "80%",
          data: usuario,
        });
        dialogRef.afterClosed().subscribe((result: unknown) => result && this.buscar());
      },
    });
  }

  eliminarUsuario(usuario: Usuario): void {
    this.usuariosService.eliminarUsuario(usuario.idUser!).subscribe({
      next: () => this.buscar(),
      error: (err) => console.error("Error al eliminar usuario:", err),
    });
  }
}
