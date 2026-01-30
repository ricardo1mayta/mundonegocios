import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidosGeneralGraficoComponent } from './pedidos-general-grafico.component';

describe('PedidosGeneralGraficoComponent', () => {
  let component: PedidosGeneralGraficoComponent;
  let fixture: ComponentFixture<PedidosGeneralGraficoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PedidosGeneralGraficoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PedidosGeneralGraficoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
