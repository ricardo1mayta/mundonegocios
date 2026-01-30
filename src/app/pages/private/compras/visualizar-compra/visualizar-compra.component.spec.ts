import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarCompraComponent } from './visualizar-compra.component';

describe('VisualizarCompraComponent', () => {
  let component: VisualizarCompraComponent;
  let fixture: ComponentFixture<VisualizarCompraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisualizarCompraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisualizarCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
