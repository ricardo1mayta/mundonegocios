import { NgModule } from '@angular/core';

@NgModule({})
export class MatNativeDateModule {}

export function provideNativeDateAdapter() {
  return { provide: MatNativeDateModule, useValue: MatNativeDateModule };
}
