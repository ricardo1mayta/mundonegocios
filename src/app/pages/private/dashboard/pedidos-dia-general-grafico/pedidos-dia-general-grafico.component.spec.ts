import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidosDiaGeneralGraficoComponent } from './pedidos-dia-general-grafico.component';

describe('PedidosDiaGeneralGraficoComponent', () => {
  let component: PedidosDiaGeneralGraficoComponent;
  let fixture: ComponentFixture<PedidosDiaGeneralGraficoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PedidosDiaGeneralGraficoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PedidosDiaGeneralGraficoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
