import { Component, effect, EventEmitter, inject, Output, signal } from '@angular/core';
import { ClickOutsideDirective } from '../../../../shared/directives/click-outside.directive';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, ClickOutsideDirective],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  /** signal reactiva que viene DIRECTO del servicio */
  auth = inject(AuthService);

  menuAbierto = false;
  @Output() toggleSidebar = new EventEmitter<void>();

  constructor(private router: Router) {}

  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }

  cerrarSesion() {
    this.auth.logout(); // limpia LS, signal y navega
  }
}