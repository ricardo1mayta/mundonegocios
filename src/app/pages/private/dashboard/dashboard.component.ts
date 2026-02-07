import { Component, computed, signal } from '@angular/core';
import { MonthlySalesChartComponent } from '../../../shared/components/ecommerce/monthly-sales-chart/monthly-sales-chart.component';
import { StatisticsChartComponent } from '../../../shared/components/ecommerce/statics-chart/statics-chart.component';
import { ReportePedidosService } from '../../../core/services/reportes/reporte-pedidos.service';
import type { ApexAxisChartSeries } from 'ng-apexcharts';

@Component({
  selector: 'app-dashboard',
  imports: [MonthlySalesChartComponent, StatisticsChartComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  pedDia = signal(0);
  pedMes = signal(0);
  monthlySeries = signal<ApexAxisChartSeries>([{ name: 'Pedidos', data: [] }]);
  monthlyCategories = signal<string[]>([]);
  generalSeries = signal<ApexAxisChartSeries>([{ name: 'Pedidos', data: [] }]);
  generalCategories = signal<string[]>([]);
  compareSeries = signal<ApexAxisChartSeries>([
    { name: 'Sede', data: [] },
    { name: 'General', data: [] },
  ]);

  ultimoMesSede = computed(() => {
    const series = this.monthlySeries();
    const data = series?.[0]?.data as number[] | undefined;
    return data && data.length ? data[data.length - 1] : 0;
  });

  ultimoMesGeneral = computed(() => {
    const series = this.generalSeries();
    const data = series?.[0]?.data as number[] | undefined;
    return data && data.length ? data[data.length - 1] : 0;
  });

  constructor(private reportePedidosService: ReportePedidosService) {
    this.reportePedidosService.getPedidosMensuales().subscribe((resp: any[]) => {
      this.monthlyCategories.set(resp.map((r) => `${String(r.mes).padStart(2, '0')}/${r.anio}`));
      const sedeData = resp.map((r) => r.total);
      this.monthlySeries.set([{ name: 'Pedidos', data: sedeData }]);
      this.compareSeries.set([
        { name: 'Sede', data: sedeData },
        { name: 'General', data: (this.compareSeries()[1]?.data as number[]) ?? [] },
      ]);
    });

    this.reportePedidosService.getPedidosMensualesGeneral().subscribe((resp: any[]) => {
      this.generalCategories.set(resp.map((r) => `${String(r.mes).padStart(2, '0')}/${r.anio}`));
      const generalData = resp.map((r) => r.total);
      this.generalSeries.set([{ name: 'Pedidos', data: generalData }]);
      this.compareSeries.set([
        { name: 'Sede', data: (this.compareSeries()[0]?.data as number[]) ?? [] },
        { name: 'General', data: generalData },
      ]);
    });

    this.reportePedidosService.getPedidosDia().subscribe((data: any) => {
      if (typeof data === 'number') {
        this.pedDia.set(data);
      } else {
        this.pedDia.set(data?.totalDia ?? 0);
        this.pedMes.set(data?.totalMes ?? 0);
      }
    });
  }
}
