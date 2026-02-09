
import { Component, computed, inject } from '@angular/core';
import { PageBreadcrumbComponent } from '../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { UserMetaCardComponent } from '../../shared/components/user-profile/user-meta-card/user-meta-card.component';
import { UserInfoCardComponent } from '../../shared/components/user-profile/user-info-card/user-info-card.component';
import { UserAddressCardComponent } from '../../shared/components/user-profile/user-address-card/user-address-card.component';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  imports: [
    PageBreadcrumbComponent,
    UserMetaCardComponent,
    UserInfoCardComponent,
    UserAddressCardComponent
],
  templateUrl: './profile.component.html',
  styles: ``
})
export class ProfileComponent {
  private readonly auth = inject(AuthService);
  readonly profile = computed(() => this.auth.ctx());

  constructor() {
    if (!this.auth.ctx()) {
      this.auth.loadContext().subscribe({
        next: (ctx) => this.auth.ctx.set(ctx),
        error: () => {
          // silencioso: el interceptor ya muestra alerta
        },
      });
    }
  }
}
