import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarStockModalComponent } from './editar-stock-modal.component';

describe('EditarStockModalComponent', () => {
  let component: EditarStockModalComponent;
  let fixture: ComponentFixture<EditarStockModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarStockModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarStockModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});