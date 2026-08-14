import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { PrimeNgModule } from "../../../../core/modules/primeng/primeng.module";

@Component({
  selector: "app-checkbox",
  imports: [CommonModule, FormsModule, PrimeNgModule],
  template: `
    <label class="flex items-center gap-3 group cursor-pointer" [ngClass]="{ 'cursor-not-allowed opacity-60': disabled }">
      <p-checkbox
        [inputId]="id"
        [binary]="true"
        [disabled]="disabled"
        [ngModel]="checked"
        (ngModelChange)="onCheckedChange($event)"
        [styleClass]="className"
      ></p-checkbox>
      @if (label) {
        <span class="text-sm font-medium text-gray-800 dark:text-gray-200">
          {{ label }}
        </span>
      }
    </label>
  `,
  styles: ``,
})
export class CheckboxComponent {
  @Input() label?: string;
  @Input() checked = false;
  @Input() className = "";
  @Input() id?: string;
  @Input() disabled = false;
  @Output() checkedChange = new EventEmitter<boolean>();

  onCheckedChange(checked: boolean) {
    this.checked = checked;
    this.checkedChange.emit(checked);
  }
}