import { TestBed } from '@angular/core/testing';
import { BASE_URL } from '../../tokens/base-url.token';
import { ApiPrefixInterceptor } from './api-prefix.interceptor';

describe('ApiPrefixInterceptor', () => {

    let service: ApiPrefixInterceptor;
    const baseUrl = '';

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [{ provide: BASE_URL, useValue: baseUrl }]
        });
        service = TestBed.get(ApiPrefixInterceptor);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
