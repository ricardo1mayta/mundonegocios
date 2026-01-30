import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SidebarService } from '../../../../core/services/sidebar/sidebar.service';
import { AuthService } from '../../../../core/services/auth.service';
import { MenuNode } from '../../../../core/models/menu/menu-node';
import { MenuService } from '../../../../core/services/menu/menu.service';
import { MenuRolService } from '../../../../core/services/menu/menu-rol.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnInit {
  /* ====== datos ====== */
  menu: MenuNode[] = [];
  datatosuario: any;

  /* ====== ui state ====== */
  colapsado = false; // ancho: w-64 ↔ w-20
  expandedItems = new Set<object>(); // ramas abiertas (modo ancho)
  hoverParent: any | null = null; // padre que muestra fly-out (modo colapsado)

  constructor(private menuService: MenuRolService, private sidebarService: SidebarService, private auth: AuthService) {}

  /* ---------- lifecycle ---------- */
  ngOnInit(): void {
    const idRol = 1,
      idSede = 10;

    this.menuService.getMenu(idRol, idSede).subscribe({
      next: data => (this.menu = data),
      error: err => console.error('Error menú', err),
    });

    this.sidebarService.getDatosUsuario().subscribe({
      next: r => {
        this.datatosuario = r.data ?? {};
        localStorage.setItem('datosUsuario', JSON.stringify(this.datatosuario));
        this.auth.usuario.set(this.datatosuario);
      },
      error: err => console.error('Error datos usuario', err),
    });
  }

  /* ---------- handlers ---------- */
  toggleColapso() {
    this.colapsado = !this.colapsado;
  }

  /** click sobre un padre (solo se usa en modo ancho) */
  toggle(item: object) {
    if (!this.colapsado) {
      this.expandedItems.has(item) ? this.expandedItems.delete(item) : this.expandedItems.add(item);
    }
  }

  /** hover (modo colapsado) */
  onHover(item: object) {
    if (this.colapsado) this.hoverParent = item;
  }
  onLeave(item: object) {
    if (this.colapsado && this.hoverParent === item) this.hoverParent = null;
  }

  /** decide si un nodo está expandido */
  isExpanded(item: object) {
    return this.colapsado ? this.hoverParent === item : this.expandedItems.has(item);
  }
}
