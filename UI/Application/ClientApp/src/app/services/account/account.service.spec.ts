import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NgxHttpParamsService } from '@renet-consulting/ngx-http-params';
import { HTTP_HEADER_NAMES } from '~/enums/http-header-names.type';
import { AccountService } from './account.service';

describe('AccountService', () => {

    let service: AccountService;
    let params: jasmine.SpyObj<NgxHttpParamsService>;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [{ provide: NgxHttpParamsService, useValue: jasmine.createSpyObj('NgxHttpParamsService', ['getParams']) }]
        });
        service = TestBed.get(AccountService);
        params = TestBed.get(NgxHttpParamsService);
        httpTestingController = TestBed.get(HttpTestingController);
    });

    afterEach(() => httpTestingController.verify());

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('changePassword', () => {
        service.changePassword(null).subscribe();
        const req = httpTestingController.expectOne(`${service.url}/password/change`);
        expect(req.request.method).toEqual('POST');
        expect(req.request.headers.has(HTTP_HEADER_NAMES.allowHttpError)).toEqual(true);
        req.flush(null);
    });
    it('prepResetPassword', () => {
        const query = 'bob';
        params.getParams.and.returnValue(query);
        service.prepResetPassword(null).subscribe();
        const req = httpTestingController.expectOne(`${service.url}/password/send/token`);
        expect(req.request.method).toEqual('GET');
        expect(params.getParams).toHaveBeenCalled();
        req.flush(null);
    });
    it('resetPassword', () => {
        service.resetPassword(null).subscribe();
        const req = httpTestingController.expectOne(`${service.url}/password/reset`);
        expect(req.request.method).toEqual('POST');
        expect(req.request.headers.has(HTTP_HEADER_NAMES.allowHttpError)).toEqual(true);
        req.flush(null);
    });
    it('confirmEmail', () => {
        const query = 'bob';
        params.getParams.and.returnValue(query);
        service.confirmEmail(null).subscribe();
        const req = httpTestingController.expectOne(`${service.url}/email/confirm`);
        expect(req.request.method).toEqual('GET');
        expect(params.getParams).toHaveBeenCalled();
        req.flush(null);
    });
    it('resendConfirmation', () => {
        const query = 'bob';
        params.getParams.and.returnValue(query);
        service.resendConfirmation(null).subscribe();
        const req = httpTestingController.expectOne(`${service.url}/email/send/token`);
        expect(req.request.method).toEqual('GET');
        expect(params.getParams).toHaveBeenCalled();
        req.flush(null);
    });
});
