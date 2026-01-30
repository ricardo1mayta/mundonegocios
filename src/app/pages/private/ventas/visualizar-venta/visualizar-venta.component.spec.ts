import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarVentaComponent } from './visualizar-venta.component';

describe('VisualizarVentaComponent', () => {
  let component: VisualizarVentaComponent;
  let fixture: ComponentFixture<VisualizarVentaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisualizarVentaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisualizarVentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
