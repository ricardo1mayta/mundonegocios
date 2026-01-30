import { TestBed } from '@angular/core/testing';

import { MenuRolService } from './menu-rol.service';

describe('MenuRolService', () => {
  let service: MenuRolService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MenuRolService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
