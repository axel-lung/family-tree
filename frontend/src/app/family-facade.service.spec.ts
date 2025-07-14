import { TestBed } from '@angular/core/testing';

import { FamilyFacadeService } from './family-facade.service';

describe('FamilyFacadeService', () => {
  let service: FamilyFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FamilyFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
