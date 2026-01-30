import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidosDiaGraficoComponent } from './pedidos-dia-grafico.component';

describe('PedidosDiaGraficoComponent', () => {
  let component: PedidosDiaGraficoComponent;
  let fixture: ComponentFixture<PedidosDiaGraficoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PedidosDiaGraficoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PedidosDiaGraficoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
