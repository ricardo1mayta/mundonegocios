import { Component, EventEmitter, Input, NgModule, Output } from '@angular/core';

export interface PageEvent {
  pageIndex: number;
  pageSize: number;
  length: number;
}

export class MatPaginatorIntl {
  itemsPerPageLabel = '';
  nextPageLabel = '';
  previousPageLabel = '';
  firstPageLabel = '';
  lastPageLabel = '';

  getRangeLabel(page: number, pageSize: number, length: number): string {
    const total = length ?? 0;
    return `${page * pageSize + 1} - ${Math.min((page + 1) * pageSize, total)} de ${total}`;
  }
}

@Component({
  selector: 'mat-paginator',
  standalone: true,
  template: '',
})
export class MatPaginator {
  @Input() pageSizeOptions: number[] = [];
  @Input() length = 0;
  @Output() page = new EventEmitter<PageEvent>();
}

@NgModule({
  imports: [MatPaginator],
  exports: [MatPaginator],
})
export class MatPaginatorModule {}
