import { Component, NgModule } from '@angular/core';

@Component({
  selector: 'mat-form-field',
  standalone: true,
  template: '<ng-content></ng-content>',
})
export class MatFormField {}

@NgModule({
  imports: [MatFormField],
  exports: [MatFormField],
})
export class MatFormFieldModule {}
