import { NgModule } from '@angular/core'
import {
    DataTableComponent,
    AccionTablaComponent,
    ColumnaTablaComponent,
} from './data-table.component'

@NgModule({
    declarations: [],
    imports: [DataTableComponent, ColumnaTablaComponent, AccionTablaComponent],
    exports: [DataTableComponent, ColumnaTablaComponent, AccionTablaComponent],
})
export class DataTableModule {}