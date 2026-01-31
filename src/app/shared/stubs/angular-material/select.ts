import { Component, NgModule } from '@angular/core';

@Component({
  selector: 'mat-select',
  standalone: true,
  template: '<ng-content></ng-content>',
})
export class MatSelect {}

@Component({
  selector: 'mat-option',
  standalone: true,
  template: '<ng-content></ng-content>',
})
export class MatOption {}

@NgModule({
  imports: [MatSelect, MatOption],
  exports: [MatSelect, MatOption],
})
export class MatSelectModule {}
