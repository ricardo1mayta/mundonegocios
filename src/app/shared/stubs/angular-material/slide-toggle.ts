import { Component, EventEmitter, Input, NgModule, Output } from '@angular/core';

export class MatSlideToggleChange {
  constructor(public checked: boolean) {}
}

@Component({
  selector: 'mat-slide-toggle',
  standalone: true,
  template: '<ng-content></ng-content>',
})
export class MatSlideToggle {
  @Input() checked = false;
  @Output() change = new EventEmitter<MatSlideToggleChange>();
}

@NgModule({
  imports: [MatSlideToggle],
  exports: [MatSlideToggle],
})
export class MatSlideToggleModule {}
