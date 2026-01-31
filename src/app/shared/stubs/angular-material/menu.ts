import { Component, Directive, Input, NgModule } from '@angular/core';

@Component({
  selector: 'mat-menu',
  standalone: true,
  template: '<ng-content></ng-content>',
  exportAs: 'matMenu',
})
export class MatMenu {}

@Directive({
  selector: '[matMenuTriggerFor]',
  standalone: true,
})
export class MatMenuTriggerFor {
  @Input('matMenuTriggerFor') menu?: MatMenu;
}

@Directive({
  selector: '[mat-menu-item]',
  standalone: true,
})
export class MatMenuItem {}

@NgModule({
  imports: [MatMenu, MatMenuTriggerFor, MatMenuItem],
  exports: [MatMenu, MatMenuTriggerFor, MatMenuItem],
})
export class MatMenuModule {}
