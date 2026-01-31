import { Component, NgModule } from '@angular/core';

@Component({
  selector: 'mat-stepper',
  standalone: true,
  template: '<ng-content></ng-content>',
})
export class MatStepper {}

@NgModule({
  imports: [MatStepper],
  exports: [MatStepper],
})
export class MatStepperModule {}
