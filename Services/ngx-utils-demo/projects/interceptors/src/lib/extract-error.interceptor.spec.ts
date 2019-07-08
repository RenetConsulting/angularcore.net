import { HttpHandler, HttpRequest, HTTP_INTERCEPTORS, HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ExtractErrorInterceptor } from './extract-error.interceptor';
import { throwError } from 'rxjs';

describe('ExtractErrorService', () => {

    let service: ExtractErrorInterceptor;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: HTTP_INTERCEPTORS, useClass: ExtractErrorInterceptor },
            ]
        });

        service = TestBed.get(HTTP_INTERCEPTORS);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('intercept', (done) => {
        const request = jasmine.createSpyObj<HttpRequest<any>>('HttpRequest', ['clone']);
        const handler = jasmine.createSpyObj<HttpHandler>('HttpHandler', ['handle']);
        const error = { error: 'bob' } as HttpErrorResponse;
        handler.handle.and.returnValue(throwError(error));
        service.intercept(request, handler).subscribe(() => {
            fail('should be an error');
        }, e => {
            done();
            expect(e).toEqual(error.error);
        });
        expect(handler.handle).toHaveBeenCalledWith(request);
    });
});
