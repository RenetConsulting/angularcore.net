import { HttpParams } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NgxHttpParamsService } from '@renet-consulting/ngx-http-params';
import { AuthService } from './auth.service';
import { HTTP_HEADER_NAMES } from './http-header-names.type';
import { IAuthUser } from './user';

describe('AuthService', () => {

    let service: AuthService;
    let params: jasmine.SpyObj<NgxHttpParamsService>;
    let controller: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [{ provide: NgxHttpParamsService, useValue: jasmine.createSpyObj('NgxHttpParamsService', ['map']) }]
        });
        service = TestBed.get(AuthService);
        params = TestBed.get(NgxHttpParamsService);
        controller = TestBed.get(HttpTestingController);
        params.map.and.returnValue(new HttpParams());
    });

    afterEach(() => controller.verify());

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('signin', () => {
        const user = { email: 'qwe@qwe', password: 'bob' } as IAuthUser;
        service.signin(user).subscribe();
        const req = controller.expectOne(`/connect/token`);
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
    it('signup', () => {
        const user = { email: 'qwe@qwe', password: 'qweqwe' } as IAuthUser;
        service.signup(user).subscribe();
        const req = controller.expectOne(`/api/account/register`);
        expect(req.request.method).toEqual('POST');
        expect(req.request.headers.has(HTTP_HEADER_NAMES.allowError)).toEqual(true);
        req.flush(null);
    });
    it('signup', () => {
        service.signout().subscribe();
        const req = controller.expectOne(`/connect/signout`);
        expect(req.request.method).toEqual('DELETE');
        expect(req.request.headers.has(HTTP_HEADER_NAMES.allowExpiredToken)).toEqual(true);
        req.flush(null);
    });
});
