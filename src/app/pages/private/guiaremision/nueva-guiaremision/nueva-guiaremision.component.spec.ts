import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevaGuiaremisionComponent } from './nueva-guiaremision.component';

describe('NuevaGuiaremisionComponent', () => {
  let component: NuevaGuiaremisionComponent;
  let fixture: ComponentFixture<NuevaGuiaremisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuevaGuiaremisionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NuevaGuiaremisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
