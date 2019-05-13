import { HttpParams } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NgxHttpParamsService } from '@renet-consulting/ngx-http-params';
import { HTTP_HEADER_NAMES } from '~/enums/http-header-names.type';
import { IUser } from '~/interfaces/user';
import { AuthorizationService } from './authorization.service';

describe('AuthorizationService', () => {

    let service: AuthorizationService;
    let params: jasmine.SpyObj<NgxHttpParamsService>;
    let controller: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [{ provide: NgxHttpParamsService, useValue: jasmine.createSpyObj('NgxHttpParamsService', ['map']) }]
        });
        service = TestBed.get(AuthorizationService);
        params = TestBed.get(NgxHttpParamsService);
        controller = TestBed.get(HttpTestingController);
        params.map.and.returnValue(new HttpParams());
    });

    afterEach(() => controller.verify());

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('signin', () => {
        const user = { email: 'qwe@qwe', password: 'bob' } as IUser;
        service.signin(user).subscribe();
        const req = controller.expectOne(`/connect/token`);
        expect(req.request.method).toEqual('POST');
        expect(req.request.headers.has(HTTP_HEADER_NAMES.allowAnonymous)).toEqual(true);
        expect(req.request.headers.has(HTTP_HEADER_NAMES.allowHttpError)).toEqual(true);
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
        const user = { captcha: { captcha: 'qwe', hash: 'asdq1' } } as IUser;
        service.signup(user).subscribe();
        const req = controller.expectOne(`/api/account/register`);
        expect(req.request.method).toEqual('POST');
        expect(req.request.headers.has(HTTP_HEADER_NAMES.allowHttpError)).toEqual(true);
        expect(params.map).toHaveBeenCalledWith(user.captcha);
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
