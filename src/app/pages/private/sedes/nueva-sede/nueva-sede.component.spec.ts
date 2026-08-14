import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevaSedeComponent } from './nueva-sede.component';

describe('NuevaSedeComponent', () => {
  let component: NuevaSedeComponent;
  let fixture: ComponentFixture<NuevaSedeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuevaSedeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NuevaSedeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});