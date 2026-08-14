import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { PrimeNgModule } from "../../../../core/modules/primeng/primeng.module";

@Component({
  selector: "app-input-field",
  imports: [CommonModule, PrimeNgModule],
  template: `
    <div class="relative">
      <input
        pInputText
        [type]="type"
        [id]="id"
        [name]="name"
        [placeholder]="placeholder"
        [value]="value"
        [min]="min"
        [max]="max"
        [step]="step"
        [disabled]="disabled"
        class="prime-form-input"
        [ngClass]="inputClasses"
        (input)="onInput($event)"
      />

      @if (hint) {
        <p
          class="mt-1.5 text-xs"
          [ngClass]="{
            'text-error-500': error,
            'text-success-500': success,
            'text-gray-500': !error && !success
          }"
        >
          {{ hint }}
        </p>
      }
    </div>
  `,
})
export class InputFieldComponent {
  @Input() type: string = "text";
  @Input() id?: string = "";
  @Input() name?: string = "";
  @Input() placeholder?: string = "";
  @Input() value: string | number = "";
  @Input() min?: string;
  @Input() max?: string;
  @Input() step?: number;
  @Input() disabled: boolean = false;
  @Input() success: boolean = false;
  @Input() error: boolean = false;
  @Input() hint?: string;
  @Input() className: string = "";

  @Output() valueChange = new EventEmitter<string | number>();

  get inputClasses(): Record<string, boolean> {
    return {
      [this.className]: !!this.className,
      "ng-invalid ng-dirty": this.error,
    };
  }

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.valueChange.emit(this.type === "number" ? +input.value : input.value);
  }
}