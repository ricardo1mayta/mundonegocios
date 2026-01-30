import { Component, signal, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTreeModule } from '@angular/material/tree';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { Rol } from '../../../../core/models/roles/rol';
import { MenuRolService } from '../../../../core/services/menu/menu-rol.service';
import { MenuService } from '../../../../core/services/menu/menu.service';
import { RolesService } from '../../../../core/services/roles/roles.service';

/* ---------- modelo del nodo ------------ */
interface MenuNode {
  idItem: number; // <- importante para comparar
  name: string;
  children: MenuNode[];
}

@Component({
  selector: 'app-menu',
  standalone: true,
  templateUrl: './menu.component.html',
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, MatSelectModule, MatFormFieldModule, MatCheckboxModule, MatButtonModule, MatTreeModule, MatSnackBarModule],
})
export class MenuComponent {
  /* ------------- signals y controles ----------------*/
  roles = signal<Rol[]>([]);
  rolCtrl = new FormControl<number | null>(null);

  /* árbol reactivo */
  dataSource = signal<MenuNode[]>([]);
  childrenAccessor = (n: MenuNode) => n.children ?? [];
  hasChild = (_: number, n: MenuNode) => !!n.children?.length;

  /** sólo hojas con checkbox */
  checklist = new SelectionModel<MenuNode>(true);

  /* ------------- servicios ----------------*/
  private rolesSvc = inject(RolesService);
  private menuSvc = inject(MenuService);
  private menuRolSvc = inject(MenuRolService);
  private snack = inject(MatSnackBar);

  constructor() {
    /* MENÚ COMPLETO */
    this.menuSvc.listarMenu().subscribe(tree => {
      this.normalizarChildren(tree);
      this.dataSource.set(tree);
    });

    /* ROLES */
    this.rolesSvc.obtenerTodosLosRoles().subscribe((r: any) => this.roles.set(r.data));

    /* AL CAMBIAR ROL → marcar ítems */
    this.rolCtrl.valueChanges.subscribe(rolId => {
      this.checklist.clear();
      if (!rolId) return;

      this.menuRolSvc.getItemsByRol(rolId).subscribe(ids => {
        this.marcarSeleccionados(ids.map(Number), this.dataSource());
      });
    });
  }

  /** Asegura que cada nodo tenga `children: []` */
  private normalizarChildren(nodes: MenuNode[]) {
    nodes.forEach(n => {
      if (!n.children) n.children = [];
      else this.normalizarChildren(n.children);
    });
  }

  private marcarSeleccionados(ids: number[], nodes: MenuNode[]) {
    const set = new Set(ids);

    const walk = (list: MenuNode[]) => {
      list.forEach(n => {
        if (set.has(n.idItem)) {
          this.checklist.select(n);
        }
        if (n.children?.length) walk(n.children);
      });
    };

    walk(nodes);
  }

  /* alterna un checkbox hoja */
  onLeafToggle(node: MenuNode, checked: boolean) {
    const rolId = this.rolCtrl.value; // number | null
    const menuId = node?.idItem; // number | undefined

    if (rolId == null || menuId == null) {
      this.snack.open('No se puede guardar: rol o menú inválido', 'Cerrar', { duration: 3000 });
      checked ? this.checklist.deselect(node) : this.checklist.select(node);
      return;
    }
    checked ? this.checklist.select(node) : this.checklist.deselect(node);
    const payload = { rolId, menuId, estado: checked };
    this.menuRolSvc.guardarAsignacion(payload).subscribe({
      next: () => this.snack.open('Permiso actualizado', '', { duration: 2500 }),
      error: err => {
        console.error('Error al guardar asignación', err);
        this.snack.open('Error al guardar permiso', 'Cerrar', { duration: 3000 });

        checked ? this.checklist.deselect(node) : this.checklist.select(node);
      },
    });
  }
  /* ---------------- GUARDAR ----------------*/
  guardar() {
    const rolId = this.rolCtrl.value;
    if (!rolId) return;

    const dto = this.checklist.selected.map(n => ({
      rolId,
      itemId: n.idItem,
      idSede: 1,
      flgActivo: true,
      flgLectura: true,
      flgEscritura: true,
    }));

    //  this.menuRolSvc.guardarAsignacion(dto).subscribe(() => this.snack.open('Permisos guardados', '', { duration: 2500 }));
  }
}
