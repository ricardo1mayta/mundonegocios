import { Component, Inject, signal, Signal } from '@angular/core';
import { PedidosGraficoComponent } from './pedidos-grafico/pedidos-grafico.component';
import { PedidosGeneralGraficoComponent } from './pedidos-general-grafico/pedidos-general-grafico.component';
import { PedidosDiaGraficoComponent } from './pedidos-dia-grafico/pedidos-dia-grafico.component';
import { ReportePedidosService } from '../../../core/services/reportes/reporte-pedidos.service';
import { PedidosDiaGeneralGraficoComponent } from './pedidos-dia-general-grafico/pedidos-dia-general-grafico.component';

@Component({
  selector: 'app-dashboard',
  imports: [PedidosGeneralGraficoComponent, PedidosGraficoComponent, PedidosDiaGraficoComponent, PedidosDiaGeneralGraficoComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  pedDia = signal(0);
  pedMes = signal(0);
  constructor(private reportePedidosService: ReportePedidosService) {
    this.reportePedidosService.getPedidosDia().subscribe((data: any) => {
      this.pedDia.set(data.totalDia);
      this.pedMes.set(data.totalMes);
    });
  }
}
