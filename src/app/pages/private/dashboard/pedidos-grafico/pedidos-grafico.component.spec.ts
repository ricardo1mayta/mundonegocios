import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidosGraficoComponent } from './pedidos-grafico.component';

describe('PedidosGraficoComponent', () => {
  let component: PedidosGraficoComponent;
  let fixture: ComponentFixture<PedidosGraficoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PedidosGraficoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PedidosGraficoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
