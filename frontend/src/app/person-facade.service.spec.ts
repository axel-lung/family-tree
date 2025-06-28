import { TestBed } from '@angular/core/testing';

import { PersonFacadeService } from './person-facade.service';

describe('PersonFacadeService', () => {
  let service: PersonFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PersonFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
