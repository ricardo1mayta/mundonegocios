import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../../../core/services/auth.service";
@Component({
  selector: "app-login",
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.css",
})
export class LoginComponent {
  email: string = "";
  password: string = "";
  showPassword = false;
  errorMessage = "";
  private auth = inject(AuthService);

  constructor(private router: Router) {}

  login() {
    this.auth.login({ username: this.email, password: this.password }).subscribe({
      next: () => this.router.navigate(["/admin"]),
      error: (err) => (this.errorMessage = "Credenciales inválidas"),
    });
  }
}
