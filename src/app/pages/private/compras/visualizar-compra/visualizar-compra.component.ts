import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Router } from '@angular/router';
import { PedidosService } from '../../../../core/services/pedidos/pedidos.service';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogClose, MatDialogContent } from '@angular/material/dialog';
import { CotizacionesService } from '../../../../core/services/cotizaciones/cotizaciones.service';
import { ComprasService } from '../../../../core/services/compras/compras.service';

@Component({
  selector: 'app-visualizar-compra',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatDialogContent, MatDialogActions, MatDialogClose],
  templateUrl: './visualizar-compra.component.html',
  styleUrl: './visualizar-compra.component.css',
})
export class VisualizarCompraComponent {
  private pedidosService = inject(ComprasService);

  isEdit = signal(false);
  editingId = signal<number | null>(null);

  private router = inject(Router);
  page = signal(1);
  pageSize = signal(10);
  pageSizes = [10, 20, 30];

  private readonly data = inject(MAT_DIALOG_DATA);
  compra = signal<any>(null);

  constructor(private dialog: MatDialog) {
    effect(() => {
      if (this.data.pedido) {
        this.cargarPedido(this.data.pedido.id);
      }
    });
  }

  private cargarPedido(id: number) {
    this.pedidosService.obtenerCompraPorId(id).subscribe((comp: any) => {
      this.compra.set(comp.data);
    });
  }
}
