import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { PageBreadcrumbComponent } from "../../../shared/components/common/page-breadcrumb/page-breadcrumb.component";
import { SupportCardComponent } from "../../../shared/components/support-card/support-card.component";

@Component({
  selector: "app-soporte",
  standalone: true,
  imports: [CommonModule, PageBreadcrumbComponent, SupportCardComponent],
  templateUrl: "./soporte.component.html",
  styleUrl: "./soporte.component.css",
})
export class SoporteComponent {}