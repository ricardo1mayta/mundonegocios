import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { PrimeNgModule } from "../../../../core/modules/primeng/primeng.module";

export interface Option {
  value: string;
  label: string;
}

@Component({
  selector: "app-select",
  imports: [FormsModule, PrimeNgModule],
  templateUrl: "./select.component.html",
})
export class SelectComponent implements OnInit {
  @Input() options: Option[] = [];
  @Input() placeholder: string = "Select an option";
  @Input() className: string = "";
  @Input() defaultValue: string = "";
  @Input() value: string = "";

  @Output() valueChange = new EventEmitter<string>();

  ngOnInit() {
    if (!this.value && this.defaultValue) {
      this.value = this.defaultValue;
    }
  }

  onChange(value: string) {
    this.value = value;
    this.valueChange.emit(value);
  }
}