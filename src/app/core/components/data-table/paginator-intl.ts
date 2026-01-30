import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { Subject } from 'rxjs';

// Clase para la internacionalización de la paginación
@Injectable()
export class PaginatorIntl implements MatPaginatorIntl {
  changes = new Subject<void>();

  firstPageLabel = `Primera página`;
  itemsPerPageLabel = `Registros por página:`;
  lastPageLabel = `Última página`;
  nextPageLabel = 'Siguiente';
  previousPageLabel = 'Anterior';

  getRangeLabel(page: number, pageSize: number, length: number): string {
    if (length === 0) {
      return `0 registros`;
    }

    const limit = Math.min(length, (page + 1) * pageSize);
    return `${page * pageSize + 1} - ${limit} de ${length}`;
  }
}
