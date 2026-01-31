import { Directive, NgModule } from '@angular/core';

@Directive({
  selector: '[matInput]',
  standalone: true,
})
export class MatInput {}

@NgModule({
  imports: [MatInput],
  exports: [MatInput],
})
export class MatInputModule {}
