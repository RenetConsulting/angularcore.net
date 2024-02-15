import { HttpHandler, HttpHeaders, HttpParams, HttpRequest, HttpResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { NgxHttpParamsService } from '@renet-consulting/ngx-http-params';
import { of, Subject } from 'rxjs';
import { AuthDefaultOptions } from './auth-default-options';
import { AuthInterceptor } from './auth.interceptor';
import { HTTP_HEADER_NAMES } from './http-header-names.type';
import { IToken } from './token';
import { TokenService } from './token.service';

describe('AuthInterceptor', () => {

    let interceptor: AuthInterceptor;

    let params: jasmine.SpyObj<NgxHttpParamsService>;
    let options: AuthDefaultOptions;
    let token: jasmine.SpyObj<TokenService>;
    let handler: jasmine.SpyObj<HttpHandler>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: NgxHttpParamsService, useValue: jasmine.createSpyObj('NgxHttpParamsService', ['map']) },
                { provide: TokenService, useValue: jasmine.createSpyObj('TokenService', ['get', 'setToken']) }
            ]
        });

        interceptor = TestBed.inject(AuthInterceptor);
        params = TestBed.inject(NgxHttpParamsService) as jasmine.SpyObj<NgxHttpParamsService>;
        options = TestBed.inject(AuthDefaultOptions);
        token = TestBed.inject(TokenService) as jasmine.SpyObj<TokenService>;

        handler = jasmine.createSpyObj<HttpHandler>('HttpHandler', ['handle']);
    });

    it('should be created', () => {
        expect(interceptor).toBeTruthy();
    });
    it('subjects', () => {
        expect(interceptor.subjects).toEqual([]);
    });
    it('request', () => {
        const refresh_token = 'refresh_token';
        token.get.and.returnValue(refresh_token);
        params.map.and.returnValue(new HttpParams());
        const request = interceptor.request;
        expect(request.method).toEqual('POST');
        expect(request.url).toEqual(options.apiRefreshToken);
        expect(request.body).toEqual('');
        expect(request.headers.has(HTTP_HEADER_NAMES.contentType)).toEqual(true);
        expect(token.get).toHaveBeenCalledWith('refresh_token');
        expect(params.map).toHaveBeenCalledWith({
            grant_type: 'refresh_token',
            scope: 'offline_access',
            refresh_token,
        });
    });

    describe('intercept', () => {

        let httpRequest: HttpRequest<any>;
        let headers: jasmine.SpyObj<HttpHeaders>;

        beforeEach(() => {
            headers = jasmine.createSpyObj<HttpHeaders>('HttpHeaders', ['has']);
            headers.has.and.returnValue(false);
            httpRequest = { headers: headers as HttpHeaders } as HttpRequest<any>;
        });

        it('invalid token', () => {
            interceptor.intercept(httpRequest, handler);
            expect(handler.handle).toHaveBeenCalledWith(httpRequest);
        });

        describe('valid token', () => {

            it('not expired', () => {
                Object.defineProperty(interceptor, 'token', { get: () => ({ valid: true, expired: false } as Partial<TokenService>) });
                const authHttpRequest = {} as HttpRequest<any>;
                spyOn(interceptor, 'setAuth').and.returnValue(authHttpRequest);
                interceptor.intercept(httpRequest, handler);
                expect(interceptor.setAuth).toHaveBeenCalledWith(httpRequest);
                expect(handler.handle).toHaveBeenCalledWith(authHttpRequest);
            });

            describe('expired', () => {

                beforeEach(() => {
                    Object.defineProperty(interceptor, 'token', { get: () => ({ valid: true, expired: true } as Partial<TokenService>) });
                    Object.defineProperty(interceptor, 'request', { get: () => null });
                });

                it('should add a request to subjects when loading is true and set auth to requests from subjects when data comes', () => {
                    const authHttpRequest = {} as HttpRequest<any>;
                    spyOn(interceptor, 'setAuth').and.returnValue(authHttpRequest);
                    handler.handle.and.returnValue(of(null));
                    interceptor.loading = true;
                    interceptor.intercept(httpRequest, handler).subscribe();
                    // mock coming data
                    interceptor.subjects.forEach(x => {
                        x.next(null);
                        x.complete();
                    });
                    expect(handler.handle).toHaveBeenCalledWith(authHttpRequest);
                    expect(interceptor.setAuth).toHaveBeenCalledWith(httpRequest);
                    expect(interceptor.subjects.length).toEqual(1);
                });
                it('shouldn`t call handleSuccess', () => {
                    spyOn(interceptor, 'handleSuccess');
                    spyOn(interceptor, 'handleFinalize');
                    handler.handle.and.returnValue(of(null));
                    interceptor.intercept(httpRequest, handler).subscribe();
                    expect(interceptor.handleSuccess).not.toHaveBeenCalled();
                    expect(interceptor.handleFinalize).toHaveBeenCalled();
                });
                it('should call handleSuccess', () => {
                    spyOn(interceptor, 'handleSuccess').and.returnValue(of(null));
                    spyOn(interceptor, 'handleFinalize');
                    handler.handle.and.returnValue(of(new HttpResponse()));
                    interceptor.intercept(httpRequest, handler).subscribe();
                    expect(interceptor.handleSuccess).toHaveBeenCalled();
                    expect(interceptor.handleFinalize).toHaveBeenCalled();
                });
            });
        });
    });
    it('handleSuccess', () => {
        const authHttpRequest = {} as HttpRequest<any>;
        spyOn(interceptor, 'setAuth').and.returnValue(authHttpRequest);
        const httpRequest = {} as HttpRequest<any>;
        const item = {} as IToken;
        const subject = jasmine.createSpyObj<Subject<any>>('Subject', ['next']);
        interceptor.subjects.push(subject);
        interceptor.handleSuccess(httpRequest, handler, item);
        expect(token.setToken).toHaveBeenCalledWith(item);
        expect(subject.next).toHaveBeenCalledWith(null);
        expect(interceptor.setAuth).toHaveBeenCalledWith(httpRequest);
        expect(handler.handle).toHaveBeenCalledWith(authHttpRequest);
    });
    it('handleFinalize', () => {
        const subject = jasmine.createSpyObj<Subject<any>>('Subject', ['complete']);
        interceptor.subjects.push(subject);
        interceptor.handleFinalize();
        expect(interceptor.subjects.length).toEqual(0);
        expect(interceptor.loading).toEqual(false);
    });

    describe('setAuth', () => {

        it('httpRequest', () => {
            const header = { bob: 'bob qweqwasdasd' };
            Object.defineProperty(interceptor, 'token', { get: () => ({ header } as Partial<TokenService>) });
            const httpRequest = jasmine.createSpyObj<HttpRequest<any>>('HttpRequest', ['clone']);
            interceptor.setAuth(httpRequest);
            expect(httpRequest.clone).toHaveBeenCalledWith({ setHeaders: header });
        });
        it('null', () => {
            const httpRequest = null;
            expect(interceptor.setAuth(httpRequest)).toEqual(httpRequest);
        });
    });
});
