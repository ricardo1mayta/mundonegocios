import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvertarioComponent } from './invertario.component';

describe('InvertarioComponent', () => {
  let component: InvertarioComponent;
  let fixture: ComponentFixture<InvertarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvertarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvertarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
