import { TestBed } from '@angular/core/testing';

import { CodigosService } from './codigos.service';

describe('CodigosService', () => {
  let service: CodigosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CodigosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
