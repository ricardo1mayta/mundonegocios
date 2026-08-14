import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { PrimeNgModule } from "../../../../core/modules/primeng/primeng.module";

@Component({
  selector: "app-text-area",
  imports: [CommonModule, PrimeNgModule],
  template: `
    <div class="relative">
      <textarea
        pTextarea
        [placeholder]="placeholder"
        [rows]="rows"
        [value]="value"
        (input)="onInput($event)"
        [disabled]="disabled"
        class="prime-form-input"
        [ngClass]="textareaClasses"
      ></textarea>
      @if (hint) {
        <p class="mt-2 text-sm" [ngClass]="error ? 'text-error-500' : 'text-gray-500 dark:text-gray-400'">
          {{ hint }}
        </p>
      }
    </div>
  `,
  styles: ``,
})
export class TextAreaComponent {
  @Input() placeholder = "Enter your message";
  @Input() rows = 3;
  @Input() value = "";
  @Input() className = "";
  @Input() disabled = false;
  @Input() error = false;
  @Input() hint = "";

  @Output() valueChange = new EventEmitter<string>();

  onInput(event: Event) {
    const val = (event.target as HTMLTextAreaElement).value;
    this.valueChange.emit(val);
  }

  get textareaClasses(): Record<string, boolean> {
    return {
      [this.className]: !!this.className,
      "ng-invalid ng-dirty": this.error,
    };
  }
}