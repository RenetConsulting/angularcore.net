import { HttpHandler, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { InjectionToken } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ApiPrefixInterceptor } from './api-prefix.interceptor';

describe('ApiPrefixInterceptor', () => {

    let service: ApiPrefixInterceptor;

    const prefix = 'http://localhost:8080/';
    const BASE_URL = new InjectionToken<string>('BASE_URL');

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: BASE_URL, useValue: prefix },
                { provide: String, useValue: prefix },
                { provide: HTTP_INTERCEPTORS, useClass: ApiPrefixInterceptor, deps: [BASE_URL] },
            ]
        });

        service = TestBed.inject(ApiPrefixInterceptor);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('intercept', () => {

        let request: jasmine.SpyObj<HttpRequest<any>>;
        let handler: jasmine.SpyObj<HttpHandler>;

        beforeEach(() => {
            request = jasmine.createSpyObj<HttpRequest<any>>('HttpRequest', ['clone']);
            handler = jasmine.createSpyObj<HttpHandler>('HttpHandler', ['handle']);
        });

        it('should not override url when url begins with http', () => {
            Object.defineProperty(request, 'url', { get: () => 'http://google.com' });
            service.intercept(request, handler);
            expect(request.clone).not.toHaveBeenCalled();
            expect(handler.handle).toHaveBeenCalledWith(request);
        });
        it('should not override url  when url begins with https', () => {
            Object.defineProperty(request, 'url', { get: () => 'https://google.com' });
            service.intercept(request, handler);
            expect(request.clone).not.toHaveBeenCalled();
            expect(handler.handle).toHaveBeenCalledWith(request);
        });
        it('should override url', () => {
            const clonedRequest = { url: null } as HttpRequest<any>;
            request.clone.and.returnValue(clonedRequest);
            Object.defineProperty(request, 'url', { get: () => '/api/controller' });
            service.intercept(request, handler);
            expect(request.clone).toHaveBeenCalledWith({ url: `${prefix}${request.url}` });
            expect(handler.handle).toHaveBeenCalledWith(clonedRequest);
        });
    });
});
