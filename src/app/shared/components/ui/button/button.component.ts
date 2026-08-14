import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { SafeHtmlPipe } from "../../../pipe/safe-html.pipe";
import { PrimeNgModule } from "../../../../core/modules/primeng/primeng.module";

@Component({
  selector: "app-button",
  imports: [CommonModule, SafeHtmlPipe, PrimeNgModule],
  templateUrl: "./button.component.html",
  styles: ``,
})
export class ButtonComponent {
  @Input() size: "sm" | "md" = "md";
  @Input() variant: "primary" | "outline" = "primary";
  @Input() disabled = false;
  @Input() className = "";
  @Input() startIcon?: string;
  @Input() endIcon?: string;

  @Output() btnClick = new EventEmitter<Event>();

  get styleClass(): string {
    const sizeClass = this.size === "sm" ? "p-button-sm" : "";
    return [sizeClass, this.className].filter(Boolean).join(" ");
  }

  onClick(event: Event) {
    if (!this.disabled) {
      this.btnClick.emit(event);
    }
  }
}