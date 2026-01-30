import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MastermanagerComponent } from './mastermanager.component';

describe('MastermanagerComponent', () => {
  let component: MastermanagerComponent;
  let fixture: ComponentFixture<MastermanagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MastermanagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MastermanagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
