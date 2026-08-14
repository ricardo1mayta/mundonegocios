import { TestBed } from '@angular/core/testing';

import { ReportePedidosService } from './reporte-pedidos.service';

describe('ReportePedidosService', () => {
  let service: ReportePedidosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportePedidosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});