import { Component, NgModule } from '@angular/core';

@Component({
  selector: 'mat-icon',
  standalone: true,
  template: '<ng-content></ng-content>',
})
export class MatIcon {}

@NgModule({
  imports: [MatIcon],
  exports: [MatIcon],
})
export class MatIconModule {}
