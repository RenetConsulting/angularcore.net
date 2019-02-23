import { TestBed } from '@angular/core/testing';

import { NgxLinkStylesheetService } from './ngx-link-stylesheet.service';

describe('NgxLinkStylesheetService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NgxLinkStylesheetService = TestBed.get(NgxLinkStylesheetService);
    expect(service).toBeTruthy();
  });
});
