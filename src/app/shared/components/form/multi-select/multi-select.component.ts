import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { PrimeNgModule } from "../../../../core/modules/primeng/primeng.module";

export interface Option {
  value: string;
  text: string;
}

@Component({
  selector: "app-multi-select",
  imports: [CommonModule, FormsModule, PrimeNgModule],
  templateUrl: "./multi-select.component.html",
  styles: ``,
})
export class MultiSelectComponent {
  @Input() label: string = "";
  @Input() options: Option[] = [];
  @Input() defaultSelected: string[] = [];
  @Input() disabled: boolean = false;
  @Output() selectionChange = new EventEmitter<string[]>();

  selectedOptions: string[] = [];

  ngOnInit() {
    this.selectedOptions = [...this.defaultSelected];
  }

  onChange(values: string[]) {
    this.selectedOptions = values ?? [];
    this.selectionChange.emit(this.selectedOptions);
  }
}