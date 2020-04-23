import { HttpParams } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { HTTP_HEADER_NAMES } from '@renet-consulting/auth';
import { NgxHttpParamsService } from '@renet-consulting/ngx-http-params';
import { AccountService } from './account.service';

describe('AccountService', () => {

    let service: AccountService;

    let params: jasmine.SpyObj<NgxHttpParamsService>;
    let controller: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [{ provide: NgxHttpParamsService, useValue: jasmine.createSpyObj('NgxHttpParamsService', ['map']) }]
        });

        service = TestBed.inject(AccountService);
        params = TestBed.inject(NgxHttpParamsService as any);
        controller = TestBed.inject(HttpTestingController);
        params.map.and.returnValue(new HttpParams());
    });

    afterEach(() => controller.verify());

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('changePassword', () => {
        service.changePassword(null).subscribe();
        const req = controller.expectOne(`${service.url}/password/change`);
        expect(req.request.method).toEqual('POST');
        expect(req.request.headers.has(HTTP_HEADER_NAMES.allowError)).toEqual(true);
        req.flush(null);
    });
    it('prepResetPassword', () => {
        service.prepResetPassword(null).subscribe();
        const req = controller.expectOne(`${service.url}/password/send/token`);
        expect(req.request.method).toEqual('GET');
        expect(params.map).toHaveBeenCalled();
        req.flush(null);
    });
    it('resetPassword', () => {
        service.resetPassword(null).subscribe();
        const req = controller.expectOne(`${service.url}/password/reset`);
        expect(req.request.method).toEqual('POST');
        expect(req.request.headers.has(HTTP_HEADER_NAMES.allowError)).toEqual(true);
        req.flush(null);
    });
    it('confirmEmail', () => {
        service.confirmEmail(null).subscribe();
        const req = controller.expectOne(`${service.url}/email/confirm`);
        expect(req.request.method).toEqual('GET');
        expect(params.map).toHaveBeenCalled();
        req.flush(null);
    });
    it('resendConfirmation', () => {
        service.resendConfirmation(null).subscribe();
        const req = controller.expectOne(`${service.url}/email/send/token`);
        expect(req.request.method).toEqual('GET');
        expect(params.map).toHaveBeenCalled();
        req.flush(null);
    });
});
