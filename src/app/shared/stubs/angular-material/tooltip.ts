import { Directive, NgModule } from '@angular/core';

@Directive({
  selector: '[matTooltip]',
  standalone: true,
})
export class MatTooltip {}

@NgModule({
  imports: [MatTooltip],
  exports: [MatTooltip],
})
export class MatTooltipModule {}
