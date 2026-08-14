import { TestBed } from '@angular/core/testing';

import { GuiaremisionService } from './guiaremision.service';

describe('GuiaremisionService', () => {
  let service: GuiaremisionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GuiaremisionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});