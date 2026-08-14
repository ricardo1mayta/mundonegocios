import { Component, computed, effect, inject } from "@angular/core";
import { DropdownComponent } from "../../ui/dropdown/dropdown.component";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { DropdownItemTwoComponent } from "../../ui/dropdown/dropdown-item/dropdown-item.component-two";
import { AuthService } from "src/app/core/services/auth.service";

@Component({
  selector: "app-user-dropdown",
  templateUrl: "./user-dropdown.component.html",
  imports: [CommonModule, RouterModule, DropdownComponent, DropdownItemTwoComponent],
})
export class UserDropdownComponent {
  isOpen = false;
  private auth = inject(AuthService);
  ctx = this.auth.ctx; // signal completo
  nombre = this.auth.nombres; // computed
  empresa = this.auth.razonSocial;
  img = this.auth.img;

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }
  constructor() {
    effect(() => {
      console.log("CTX =>", this.auth.ctx());
      console.log("Nombre comercial =>", this.auth.nombreComercial());
    });
  }
  closeDropdown() {
    this.isOpen = false;
  }
  cerrarSesion() {
    this.auth.logout(); // limpia LS, signal y navega
  }
}