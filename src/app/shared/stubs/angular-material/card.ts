import { Component, NgModule } from '@angular/core';

@Component({
  selector: 'mat-card',
  standalone: true,
  template: '<ng-content></ng-content>',
})
export class MatCard {}

@NgModule({
  imports: [MatCard],
  exports: [MatCard],
})
export class MatCardModule {}
