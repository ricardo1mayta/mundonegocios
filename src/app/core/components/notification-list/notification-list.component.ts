import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterLink } from '@angular/router';
import { GobAvatarComponent } from '@gob/shared/components';

@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [MatIconModule, MatListModule, RouterLink, GobAvatarComponent],
  templateUrl: './notification-list.component.html',
  styleUrl: './notification-list.component.scss'
})
export class NotificationListComponent {

}
