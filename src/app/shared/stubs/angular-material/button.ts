import { Directive, NgModule } from '@angular/core';

@Directive({
  selector: '[mat-button]',
  standalone: true,
})
export class MatButton {}

@Directive({
  selector: '[mat-icon-button]',
  standalone: true,
})
export class MatIconButton {}

@NgModule({
  imports: [MatButton, MatIconButton],
  exports: [MatButton, MatIconButton],
})
export class MatButtonModule {}
