import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Inventario } from '../../../../core/models/almacen/invetario';
import { Router } from '@angular/router';
import { PedidosService } from '../../../../core/services/pedidos/pedidos.service';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent } from '@angular/material/dialog';

@Component({
  selector: 'app-visualizar-venta',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatDialogContent, MatDialogActions, MatDialogClose],
  templateUrl: './visualizar-venta.component.html',
  styleUrl: './visualizar-venta.component.css',
})
export class VisualizarVentaComponent {
  private pedidosService = inject(PedidosService);

  isEdit = signal(false);
  editingId = signal<number | null>(null);

  private router = inject(Router);
  page = signal(1);
  pageSize = signal(10);
  pageSizes = [10, 20, 30];

  private readonly data = inject(MAT_DIALOG_DATA) as { pedido?: { id?: number } };
  pedido = signal<any>(null);

  constructor() {
    effect(() => {
      const pedidoId = this.data?.pedido?.id;
      if (pedidoId) {
        this.cargarPedido(pedidoId);
      }
    });
  }

  private cargarPedido(id: number) {
    this.pedidosService.obtenerPedidoPorId(id).subscribe((comp: any) => {
      this.pedido.set(comp.data);
    });
  }
}
