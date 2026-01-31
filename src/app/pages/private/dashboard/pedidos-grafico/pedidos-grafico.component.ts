import { Component, inject, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import type { ChartConfiguration } from 'chart.js';
import { ReportePedidosService } from '../../../../core/services/reportes/reporte-pedidos.service';
import { PedidosMensualesDto } from '../../../../core/models/reportes/pedidos-mensuales-dto';

@Component({
  standalone: true,
  selector: 'app-pedidos-grafico',
  imports: [BaseChartDirective],
  templateUrl: './pedidos-grafico.component.html',
  styleUrls: ['./pedidos-grafico.component.css'],
})
export class PedidosGraficoComponent {
  private readonly reporteSrv = inject(ReportePedidosService);

  /** Referencia al canvas para poder llamar chart.update() */
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  /** Configuración inicial (vacía) */
  data: ChartConfiguration['data'] = {
    labels: [],
    datasets: [{ label: 'Pedidos', data: [], backgroundColor: '#4F49E5' }],
  };

  readonly options: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
  };

  ngOnInit(): void {
    this.reporteSrv.getPedidosMensuales().subscribe((resp: any) => {
      // Rellena etiquetas con MES/AÑO
      this.data.labels = resp.map(r => `${r.mes.toString().padStart(2, '0')}/${r.anio}`);

      const palette = ['#4F46E5', '#22C55E', '#F97316', '#E11D48', '#0EA5E9', '#A855F7', '#FACC15', '#14B8A6', '#EF4444', '#6366F1', '#10B981', '#FB923C'];
      // Cambia el dataset (cantidad de pedidos)
      this.data.datasets[0].data = resp.map(r => r.total);
      this.data.datasets[0].backgroundColor = resp.map((_, i) => palette[i % palette.length]);

      // Refresca el lienzo
      this.chart?.update();
    });
  }
}
