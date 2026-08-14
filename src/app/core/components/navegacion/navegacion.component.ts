import { NgClass } from "@angular/common";
import { Component, signal } from "@angular/core";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";

@Component({
  selector: "app-navegacion",
  standalone: true,
  imports: [NgClass, RouterLink],
  templateUrl: "./navegacion.component.html",
  styleUrl: "./navegacion.component.scss",
})
export class NavegacionComponent {
  routes = signal<string[]>([]);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.router.events.subscribe(() => {
      const breadcrumbs = this.route.snapshot.children.map((child) => child.routeConfig?.data["breadcrumb"]);
      const breadcrumb = breadcrumbs?.flat().map((d: any) => d.label);
      const data = breadcrumb?.filter((d: any) => d && d !== "Home");
      this.routes.set(data);
    });
  }
}