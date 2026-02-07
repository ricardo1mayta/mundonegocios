import { Component, ElementRef, inject, ViewChild } from "@angular/core";
import { SidebarService } from "../../services/sidebar.service";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { ThemeToggleButtonComponent } from "../../components/common/theme-toggle/theme-toggle-button.component";
import { NotificationDropdownComponent } from "../../components/header/notification-dropdown/notification-dropdown.component";
import { UserDropdownComponent } from "../../components/header/user-dropdown/user-dropdown.component";
import { AuthService } from "src/app/core/services/auth.service";

@Component({
  selector: "app-header",
  imports: [
    CommonModule,
    RouterModule,
    ThemeToggleButtonComponent,
    NotificationDropdownComponent,
    UserDropdownComponent,
  ],
  templateUrl: "./app-header.component.html",
})
export class AppHeaderComponent {
  isApplicationMenuOpen = false;
  readonly isMobileOpen$;
  private auth = inject(AuthService);
  ctx = this.auth.ctx; // signal completo
  nombre = this.auth.nombres; // computed
  empresa = this.auth.razonSocial;
  logo = this.auth.logo;
  @ViewChild("searchInput") searchInput!: ElementRef<HTMLInputElement>;

  constructor(public sidebarService: SidebarService) {
    this.isMobileOpen$ = this.sidebarService.isMobileOpen$;
  }

  handleToggle() {
    if (window.innerWidth >= 1280) {
      this.sidebarService.toggleExpanded();
    } else {
      this.sidebarService.toggleMobileOpen();
    }
  }

  toggleApplicationMenu() {
    this.isApplicationMenuOpen = !this.isApplicationMenuOpen;
  }

  ngAfterViewInit() {
    document.addEventListener("keydown", this.handleKeyDown);
  }

  ngOnDestroy() {
    document.removeEventListener("keydown", this.handleKeyDown);
  }

  handleKeyDown = (event: KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "k") {
      event.preventDefault();
      this.searchInput?.nativeElement.focus();
    }
  };
}
