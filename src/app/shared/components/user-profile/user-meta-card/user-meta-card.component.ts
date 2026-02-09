import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MeResponse } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-user-meta-card',
  imports: [CommonModule],
  templateUrl: './user-meta-card.component.html',
  styles: ``
})
export class UserMetaCardComponent {

  @Input() profile: MeResponse | null = null;

  get displayName(): string {
    return this.profile?.nombres || '—';
  }

  get role(): string {
    return this.profile?.sedePadre || '—';
  }

  get company(): string {
    return this.profile?.nombreComercial || this.profile?.razonSocial || this.profile?.nombresede || '';
  }

  get location(): string {
    const a = this.profile?.address;
    const parts = [a?.distrito, a?.provincia, a?.departamento].filter(Boolean) as string[];
    return parts.length ? parts.join(', ') : '—';
  }

  get avatar(): string {
    return this.profile?.img || this.profile?.logo || '/images/user/user-01.jpg';
  }

  
}
