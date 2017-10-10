import { TestBed, inject } from '@angular/core/testing';

import { RechercheService } from './recherche.service';

describe('RechercheService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RechercheService]
    });
  });

  it('should be created', inject([RechercheService], (service: RechercheService) => {
    expect(service).toBeTruthy();
  }));
});
