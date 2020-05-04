import { HttpHandler, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { NoneCacheInterceptor } from './none-cache.interceptor';

describe('NoneCacheInterceptor', () => {

    let service: NoneCacheInterceptor;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: HTTP_INTERCEPTORS, useClass: NoneCacheInterceptor },
            ]
        });

        service = TestBed.inject(NoneCacheInterceptor);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('intercept', () => {
        const request = jasmine.createSpyObj<HttpRequest<any>>('HttpRequest', ['clone']);
        const handler = jasmine.createSpyObj<HttpHandler>('HttpHandler', ['handle']);
        const clonedRequest = { url: null } as HttpRequest<any>;
        request.clone.and.returnValue(clonedRequest);
        Object.defineProperty(request, 'url', { get: () => '/api/controller' });
        service.intercept(request, handler);
        expect(request.clone).toHaveBeenCalledWith({
            setHeaders: {
                'Cache-Control': 'no-store, no-cache, must-revalidate',
                Pragma: 'no-cache'
            }
        });
        expect(handler.handle).toHaveBeenCalledWith(clonedRequest);
    });
});
