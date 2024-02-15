import { HttpParams } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NgxHttpParamsService } from '@renet-consulting/ngx-http-params/src/public-api';
import { AuthDefaultOptions } from './auth-default-options';
import { AuthService } from './auth.service';
import { HTTP_HEADER_NAMES } from './http-header-names.type';
import { IAuthUser } from './user';

describe('AuthService', () => {

    let service: AuthService;
    let params: jasmine.SpyObj<NgxHttpParamsService>;
    let controller: HttpTestingController;
    let options: AuthDefaultOptions;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [{ provide: NgxHttpParamsService, useValue: jasmine.createSpyObj('NgxHttpParamsService', ['map']) }]
        });

        service = TestBed.inject(AuthService);
        params = TestBed.inject(NgxHttpParamsService) as jasmine.SpyObj<NgxHttpParamsService>;
        options = TestBed.inject(AuthDefaultOptions);
        controller = TestBed.inject(HttpTestingController);

        params.map.and.returnValue(new HttpParams());
    });

    afterEach(() => controller.verify());

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('signin', () => {

        it('signin', () => {
            const user = { email: 'qwe@qwe', password: 'bob' } as IAuthUser;
            service.signin(user).subscribe();
            const req = controller.expectOne(options.apiSignin);
            expect(req.request.method).toEqual('POST');
            expect(req.request.headers.has(HTTP_HEADER_NAMES.allowAnonymous)).toEqual(true);
            expect(req.request.headers.has(HTTP_HEADER_NAMES.allowError)).toEqual(true);
            expect(req.request.headers.has(HTTP_HEADER_NAMES.contentType)).toEqual(true);
            expect(params.map).toHaveBeenCalledWith({
                scope: 'offline_access',
                grant_type: 'password',
                password: user.password,
                username: user.email
            });
            req.flush(null);
        });
        it('has to call with options', () => {
            const user = { email: 'qwe@qwe', password: 'bob' } as IAuthUser;
            const headerName = 'bob';
            const headers = { [headerName]: 'qwe' };
            const httpParams = new HttpParams({ fromObject: headers });
            service.signin(user, { headers, params: httpParams }).subscribe();
            const req = controller.expectOne(() => true);
            expect(req.request.headers.has(headerName)).toEqual(true);
            expect(req.request.params).toEqual(httpParams);
            req.flush(null);
        });
    });

    describe('signup', () => {

        it('signup', () => {
            const user = { email: 'qwe@qwe', password: 'qweqwe' } as IAuthUser;
            service.signup(user).subscribe();
            const req = controller.expectOne(options.apiSignup);
            expect(req.request.method).toEqual('POST');
            expect(req.request.headers.has(HTTP_HEADER_NAMES.allowError)).toEqual(true);
            req.flush(null);
        });
        it('has to call with options', () => {
            const user = { email: 'qwe@qwe', password: 'bob' } as IAuthUser;
            const headerName = 'bob';
            const headers = { [headerName]: 'qwe' };
            const httpParams = new HttpParams({ fromObject: headers });
            service.signup(user, { headers, params: httpParams }).subscribe();
            const req = controller.expectOne(() => true);
            expect(req.request.headers.has(headerName)).toEqual(true);
            expect(req.request.params).toEqual(httpParams);
            req.flush(null);
        });
    });
    it('signup', () => {
        service.signout().subscribe();
        const req = controller.expectOne(options.apiSignout);
        expect(req.request.method).toEqual('DELETE');
        expect(req.request.headers.has(HTTP_HEADER_NAMES.allowExpiredToken)).toEqual(true);
        req.flush(null);
    });
});
