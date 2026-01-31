import { Component, NgModule } from '@angular/core';

@Component({
  selector: 'mat-tab-group',
  standalone: true,
  template: '<ng-content></ng-content>',
})
export class MatTabGroup {}

@Component({
  selector: 'mat-tab',
  standalone: true,
  template: '<ng-content></ng-content>',
})
export class MatTab {}

@NgModule({
  imports: [MatTabGroup, MatTab],
  exports: [MatTabGroup, MatTab],
})
export class MatTabsModule {}
