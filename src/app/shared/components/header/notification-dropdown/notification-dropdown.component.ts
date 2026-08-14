import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DropdownComponent } from '../../ui/dropdown/dropdown.component';
import { DropdownItemComponent } from '../../ui/dropdown/dropdown-item/dropdown-item.component';
import { NotificationsBusService } from 'src/app/core/services/notifications/notifications-bus.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { NotificationItem } from 'src/app/core/services/notifications/notifications.api';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-notification-dropdown',
  templateUrl: './notification-dropdown.component.html',
  imports: [CommonModule,RouterModule,DropdownComponent,DropdownItemComponent]
})
export class NotificationDropdownComponent implements OnInit {
  private readonly bus = inject(NotificationsBusService);
  private readonly auth = inject(AuthService);

  isOpen = false;
  notifications$ = this.bus.notifications$;
  state$ = this.bus.state$;
  notifying$ = this.state$.pipe(map((s) => s.hasNew));

  ngOnInit(): void {
    const sedeId = this.getSedeIdFromToken();
    if (sedeId) this.bus.refresh(sedeId);
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  closeDropdown() {
    this.isOpen = false;
  }

  markRead(item: NotificationItem) {
    this.bus.markRead(item.id);
  }

  timeAgo(value: string | number): string {
    const date = this.toDate(value);
    if (!date) return '—';
    const diff = Math.max(0, Date.now() - date.getTime());
    const seconds = Math.floor(diff / 1000);
    if (seconds < 60) return 'hace segundos';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `hace ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `hace ${hours} h`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `hace ${days} d`;
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `hace ${weeks} sem`;
    const months = Math.floor(days / 30);
    if (months < 12) return `hace ${months} mes`;
    const years = Math.floor(days / 365);
    return `hace ${years} año${years > 1 ? 's' : ''}`;
  }

  iconClass(icon?: string | null): string {
    if (!icon) return 'bg-brand-500';
    const v = String(icon).toLowerCase();
    if (v.includes('error') || v.includes('alert')) return 'bg-error-500';
    if (v.includes('warn')) return 'bg-warning-500';
    if (v.includes('success') || v.includes('ok')) return 'bg-success-500';
    return 'bg-brand-500';
  }

  private toDate(value: string | number): Date | null {
    if (!value) return null;
    if (typeof value === 'number') {
      const ms = value < 1e12 ? value * 1000 : value;
      const d = new Date(ms);
      return isNaN(d.getTime()) ? null : d;
    }
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }

  private getSedeIdFromToken(): number | null {
    const token = this.auth.accessToken();
    if (!token) return null;
    const parts = token.split('.');
    if (parts.length < 2) return null;
    try {
      const base = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const pad = base.length % 4 ? '='.repeat(4 - (base.length % 4)) : '';
      const json = JSON.parse(atob(base + pad));
      const id = json?.sedeId ?? json?.idSede ?? json?.sede;
      return Number.isFinite(Number(id)) ? Number(id) : null;
    } catch {
      return null;
    }
  }
}
