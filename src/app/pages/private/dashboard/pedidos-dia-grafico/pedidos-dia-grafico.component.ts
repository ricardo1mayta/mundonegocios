import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import type { ChartConfiguration } from 'chart.js';

@Component({
  standalone: true,
  selector: 'app-pedidos-dia-grafico',
  imports: [BaseChartDirective],
  templateUrl: './pedidos-dia-grafico.component.html',
  styleUrls: ['./pedidos-dia-grafico.component.css'],
})
export class PedidosDiaGraficoComponent implements OnChanges {
  /** Pedidos del día y acumulado del mes */
  @Input({ required: true }) pedidosDia = 0;
  @Input({ required: true }) pedidosMes = 1; // evita división por 0

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  /** Datos Chart.js */
  readonly data: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['Hoy', 'Resto del mes'],
    datasets: [{ data: [], backgroundColor: ['#22C55E', '#E5E7EB'] }],
  };

  /** Opciones (gauge semicircular) */
  readonly options: ChartConfiguration<'doughnut'>['options'] = {
    cutout: '70%',
    rotation: -90,
    circumference: 180,
    plugins: { legend: { display: false } },
    responsive: true,
    maintainAspectRatio: false,
  };

  ngOnChanges() {
    const resto = Math.max(this.pedidosMes - this.pedidosDia, 0);
    this.data.datasets[0].data = [this.pedidosDia, resto];
    this.chart?.update();
  }
}
