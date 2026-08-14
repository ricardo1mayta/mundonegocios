import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-notification-list",
  standalone: true,
  imports: [RouterLink],
  templateUrl: "./notification-list.component.html",
  styleUrl: "./notification-list.component.scss",
})
export class NotificationListComponent {}