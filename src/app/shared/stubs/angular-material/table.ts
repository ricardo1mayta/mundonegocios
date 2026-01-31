import { Directive, Input, NgModule, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[mat-table]',
  standalone: true,
})
export class MatTable {
  @Input() dataSource: unknown;
}

@Directive({
  selector: '[matColumnDef]',
  standalone: true,
})
export class MatColumnDef {
  @Input('matColumnDef') name?: string;
}

@Directive({
  selector: '[mat-header-cell]',
  standalone: true,
})
export class MatHeaderCell {}

@Directive({
  selector: '[mat-cell]',
  standalone: true,
})
export class MatCell {}

@Directive({
  selector: '[mat-header-row]',
  standalone: true,
})
export class MatHeaderRow {}

@Directive({
  selector: '[mat-row]',
  standalone: true,
})
export class MatRow {}

@Directive({
  selector: '[matHeaderCellDef]',
  standalone: true,
})
export class MatHeaderCellDef {
  constructor(public templateRef: TemplateRef<unknown>, public viewContainerRef: ViewContainerRef) {}
}

@Directive({
  selector: '[matCellDef]',
  standalone: true,
})
export class MatCellDef {
  constructor(public templateRef: TemplateRef<unknown>, public viewContainerRef: ViewContainerRef) {}
}

@Directive({
  selector: '[matHeaderRowDef]',
  standalone: true,
})
export class MatHeaderRowDef {
  @Input() matHeaderRowDef: string[] = [];
  @Input('matHeaderRowDefSticky') sticky?: boolean;
  constructor(public templateRef: TemplateRef<unknown>, public viewContainerRef: ViewContainerRef) {}
}

@Directive({
  selector: '[matRowDef]',
  standalone: true,
})
export class MatRowDef<T = unknown> {
  @Input('matRowDefColumns') columns: string[] = [];
  @Input('matRowDefWhen') when?: (index: number, rowData: T) => boolean;
  constructor(public templateRef: TemplateRef<T>, public viewContainerRef: ViewContainerRef) {}
}

export class MatTableDataSource<T = unknown> {
  paginator?: unknown;
  constructor(public data: T[] = []) {}
}

@NgModule({
  imports: [MatTable, MatHeaderCell, MatCell, MatHeaderRow, MatRow, MatHeaderCellDef, MatCellDef, MatHeaderRowDef, MatRowDef, MatColumnDef],
  exports: [MatTable, MatHeaderCell, MatCell, MatHeaderRow, MatRow, MatHeaderCellDef, MatCellDef, MatHeaderRowDef, MatRowDef, MatColumnDef],
})
export class MatTableModule {}
