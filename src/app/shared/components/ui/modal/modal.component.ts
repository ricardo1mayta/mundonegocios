import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { PrimeNgModule } from "../../../../core/modules/primeng/primeng.module";

@Component({
  selector: "app-modal",
  imports: [CommonModule, PrimeNgModule],
  templateUrl: "./modal.component.html",
  styles: ``,
})
export class ModalComponent {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Input() className = "";
  @Input() showCloseButton = true;
  @Input() isFullscreen = false;

  get dialogStyle(): Record<string, string> | null {
    return this.isFullscreen ? { width: "100vw", height: "100vh", maxHeight: "100vh" } : null;
  }

  get dialogStyleClass(): string {
    return [this.isFullscreen ? "prime-fullscreen-dialog" : "", this.className].filter(Boolean).join(" ");
  }

  onVisibleChange(visible: boolean) {
    if (!visible) {
      this.close.emit();
    }
  }
}