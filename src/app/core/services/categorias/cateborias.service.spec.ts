import { TestBed } from '@angular/core/testing';

import { CateboriasService } from './cateborias.service';

describe('CateboriasService', () => {
  let service: CateboriasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CateboriasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
