import { TestBed } from '@angular/core/testing';

import { VoluntariosService } from './voluntarios.service';

describe('VoluntariosService', () => {
  let service: VoluntariosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VoluntariosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
