import { Component, Input } from '@angular/core';
import { MeResponse } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-user-address-card',
  imports: [],
  templateUrl: './user-address-card.component.html',
  styles: ``
})
export class UserAddressCardComponent {

  @Input() profile: MeResponse | null = null;

  get direccion(): string {
    return this.profile?.address?.direccion || this.profile?.direccion || '—';
  }
  get distrito(): string {
    return this.profile?.address?.distrito || '—';
  }
  get provincia(): string {
    return this.profile?.address?.provincia || '—';
  }
  get departamento(): string {
    return this.profile?.address?.departamento || '—';
  }
  get ubigueo(): string {
    return this.profile?.address?.ubigueo || '—';
  }

  
}
