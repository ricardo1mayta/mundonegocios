import { Component, EventEmitter, Input, NgModule, Output } from '@angular/core';

export class MatCheckboxChange {
  constructor(public checked: boolean) {}
}

@Component({
  selector: 'mat-checkbox',
  standalone: true,
  template: '<ng-content></ng-content>',
})
export class MatCheckbox {
  @Input() checked = false;
  @Input() indeterminate = false;
  @Output() change = new EventEmitter<MatCheckboxChange>();
}

@NgModule({
  imports: [MatCheckbox],
  exports: [MatCheckbox],
})
export class MatCheckboxModule {}
