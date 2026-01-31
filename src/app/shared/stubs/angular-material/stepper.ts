import { Component, Input, NgModule } from '@angular/core';

@Component({
  selector: 'mat-stepper',
  standalone: true,
  template: '<ng-content></ng-content>',
})
export class MatStepper {}

@Component({
  selector: 'mat-horizontal-stepper',
  standalone: true,
  template: '<ng-content></ng-content>',
})
export class MatHorizontalStepper {
  @Input() linear: boolean | '' = false;
}

@Component({
  selector: 'mat-step',
  standalone: true,
  template: '<ng-content></ng-content>',
})
export class MatStep {
  @Input() label?: string;
  @Input() stepControl?: unknown;
}

@NgModule({
  imports: [MatStepper, MatHorizontalStepper, MatStep],
  exports: [MatStepper, MatHorizontalStepper, MatStep],
})
export class MatStepperModule {}
