import { PrimeNgModule } from 'src/app/core/modules/primeng/primeng.module';
import { Component, signal, inject, computed } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTreeModule } from '@angular/material/tree';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { Rol } from '../../../../core/models/roles/rol';
import { MenuRolService } from '../../../../core/services/menu/menu-rol.service';
import { MenuService } from '../../../../core/services/menu/menu.service';
import { RolesService } from '../../../../core/services/roles/roles.service';

interface MenuNode {
  idItem: number;
  name: string;
  children: MenuNode[];
}

@Component({
  selector: 'app-menu',
  standalone: true,
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
  imports: [FormsModule, PrimeNgModule, CommonModule, MatIconModule, MatCheckboxModule, MatButtonModule, MatTreeModule, MatSnackBarModule],
})
export class MenuComponent {
  roles = signal<Rol[]>([]);
  selectedRolId = signal<number | null>(null);
  selectedRol = computed(() => this.roles().find((r) => Number(r.idRol) === this.selectedRolId()) ?? null);

  dataSource = signal<MenuNode[]>([]);
  childrenAccessor = (n: MenuNode) => n.children ?? [];
  hasChild = (_: number, n: unknown) => {
    const node = n as MenuNode | null;
    return !!node?.children?.length;
  };

  checklist = new SelectionModel<MenuNode>(true);

  private rolesSvc = inject(RolesService);
  private menuSvc = inject(MenuService);
  private menuRolSvc = inject(MenuRolService);
  private snack = inject(MatSnackBar);

  constructor() {
    this.menuSvc.listarMenu().subscribe((tree) => {
      this.normalizarChildren(tree);
      this.dataSource.set(tree);
    });

    this.rolesSvc.obtenerTodosLosRoles().subscribe((r: any) => this.roles.set(r.data ?? []));
  }

  seleccionarRol(rolId: number) {
    if (!Number.isFinite(Number(rolId))) return;
    this.selectedRolId.set(Number(rolId));
    this.cargarPermisosDeRol(Number(rolId));
  }

  isRolSeleccionado(rolId: number): boolean {
    return Number(rolId) === this.selectedRolId();
  }

  private cargarPermisosDeRol(rolId: number) {
    this.checklist.clear();
    this.menuRolSvc.getItemsByRol(rolId).subscribe((ids) => {
      this.marcarSeleccionados((ids ?? []).map(Number), this.dataSource());
    });
  }

  private normalizarChildren(nodes: MenuNode[]) {
    nodes.forEach((n) => {
      if (!n.children) n.children = [];
      else this.normalizarChildren(n.children);
    });
  }

  private marcarSeleccionados(ids: number[], nodes: MenuNode[]) {
    const set = new Set(ids);

    const walk = (list: MenuNode[]) => {
      list.forEach((n) => {
        if (set.has(n.idItem)) {
          this.checklist.select(n);
        }
        if (n.children?.length) walk(n.children);
      });
    };

    walk(nodes);
  }

  onLeafToggle(node: MenuNode, checked: boolean) {
    const rolId = this.selectedRolId();
    const menuId = node?.idItem;

    if (rolId == null || menuId == null) {
      this.snack.open('No se puede guardar: rol o menu invalido', 'Cerrar', { duration: 3000 });
      checked ? this.checklist.deselect(node) : this.checklist.select(node);
      return;
    }

    checked ? this.checklist.select(node) : this.checklist.deselect(node);
    const payload = { rolId, menuId, estado: checked };
    this.menuRolSvc.guardarAsignacion(payload).subscribe({
      next: () => this.snack.open('Permiso actualizado', '', { duration: 2500 }),
      error: (err) => {
        console.error('Error al guardar asignacion', err);
        this.snack.open('Error al guardar permiso', 'Cerrar', { duration: 3000 });
        checked ? this.checklist.deselect(node) : this.checklist.select(node);
      },
    });
  }
}