import { TestBed } from '@angular/core/testing';

import { ApiPrefixService } from './api-prefix.service';

describe('ApiPrefixService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApiPrefixService = TestBed.get(ApiPrefixService);
    expect(service).toBeTruthy();
  });
});
