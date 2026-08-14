import { CommonModule } from '@angular/common';
import { Component, inject, signal, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ComprasService } from '../../../../core/services/compras/compras.service';

@Component({
  selector: 'app-visualizar-compra',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
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

  private readonly data = inject(MAT_DIALOG_DATA) as { pedido?: { id?: number } };
  private readonly dialogRef = inject(MatDialogRef<VisualizarCompraComponent>);
  compra = signal<any>(null);

  constructor() {
    effect(() => {
      const pedidoId = this.data?.pedido?.id;
      if (pedidoId) {
        this.cargarPedido(pedidoId);
      }
    });
  }

  private cargarPedido(id: number) {
    this.pedidosService.obtenerCompraPorId(id).subscribe((comp: any) => {
      this.compra.set(comp.data);
    });
  }

  cerrar(): void {
    this.dialogRef.close(true);
  }
}
