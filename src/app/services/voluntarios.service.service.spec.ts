import { TestBed } from '@angular/core/testing';

import { Voluntarios.ServiceService } from './voluntarios.service.service';

describe('Voluntarios.ServiceService', () => {
  let service: Voluntarios.ServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Voluntarios.ServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
