import { Component, Input } from '@angular/core';
import { MeResponse } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-user-info-card',
  imports: [],
  templateUrl: './user-info-card.component.html',
  styles: ``
})
export class UserInfoCardComponent {

  @Input() profile: MeResponse | null = null;

  get nombres(): string {
    return this.profile?.nombres || '—';
  }
  get nombresede(): string {
    return this.profile?.nombresede || '—';
  }
  get ruc(): string {
    return this.profile?.ruc || '—';
  }
  get razonSocial(): string {
    return this.profile?.razonSocial || '—';
  }
  get nombreComercial(): string {
    return this.profile?.nombreComercial || '—';
  }

  
}
