import { TestBed } from '@angular/core/testing';

import { NgxRecaptchaService } from './ngx-recaptcha.service';

describe('NgxRecaptchaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NgxRecaptchaService = TestBed.get(NgxRecaptchaService);
    expect(service).toBeTruthy();
  });
});
