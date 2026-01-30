import { CommonModule } from '@angular/common';
import { Component, Inject, inject, model, signal, ViewChild, viewChild } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, FormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DataTableComponent } from '../../../../../core/components/data-table/data-table.component';
import { IReporteExcel } from '../../../../../core/components/data-table/data-table.model';
import { DataTableModule } from '../../../../../core/components/data-table/data-table.module';
import { FormCrudComponent } from '../../../../../core/components/form-crud/form-crud.component';
import { FormFilterComponent } from '../../../../../core/components/form-crud/form-filter/form-filter.component';
import { FormListComponent } from '../../../../../core/components/form-crud/form-list/form-list.component';
import { MaterialModule } from '../../../../../core/modules/material/material.module';
import { InventarioService } from '../../../../../core/services/inventario/inventario.service';

@Component({
  selector: 'app-editar-stock-modal',
  imports: [CommonModule, MatSlideToggleModule, MaterialModule, MatDatepickerModule, MatNativeDateModule, DataTableModule, ReactiveFormsModule, FormsModule],
  templateUrl: './editar-stock-modal.component.html',
  styleUrl: './editar-stock-modal.component.css',
})
export class EditarStockModalComponent {
  @Inject(MAT_DIALOG_DATA) data: any | null = inject(MAT_DIALOG_DATA);

  stocks = signal<any[]>([]);

  @ViewChild(DataTableComponent)
  dataTable!: DataTableComponent;

  constructor(private dialog: MatDialog, private inventarioService: InventarioService) {}

  ngOnInit(): void {
    this.inventarioService.stockProductos(this.data.id).subscribe({
      next: (res: any) => {
        this.stocks.set(res.data);
      },
      error: (err: any) => {
        console.error('Error fetching stock data:', err);
      },
    });
  }
  editarStock(id: number, event: any) {
    let updatedStock = this.stocks().find(stock => stock.id === id);
    if (updatedStock) {
      updatedStock.cantDisponible = event.target.value;
      this.editar(id, updatedStock);
    }
  }
  editarPrecio(id: number, event: any) {
    let updatedStock = this.stocks().find(stock => stock.id === id);
    if (updatedStock) {
      updatedStock.costoUnitario = event.target.value;
      this.editar(id, updatedStock);
    }
  }
  editar(id: number, data: any) {
    //acutalizar stock o precio segun el imput

    if (data) {
      this.inventarioService.actualizarStock(id, { ...data }).subscribe({
        next: () => {
          console.log('Stock updated successfully');
        },
        error: (err: any) => {
          console.error('Error updating stock:', err);
        },
      });
    }
  }
  cerrar() {
    this.dialog.closeAll();
  }
}
