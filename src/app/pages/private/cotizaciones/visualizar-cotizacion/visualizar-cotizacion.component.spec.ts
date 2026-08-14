import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarCotizacionComponent } from './visualizar-cotizacion.component';

describe('VisualizarCotizacionComponent', () => {
  let component: VisualizarCotizacionComponent;
  let fixture: ComponentFixture<VisualizarCotizacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisualizarCotizacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisualizarCotizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});