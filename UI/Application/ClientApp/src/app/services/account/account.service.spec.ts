import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { HTTP_HEADER_NAMES } from '~/enums/http-header-names.type';
import { ToolsService } from '../tools/tools.service';
import { AccountService } from './account.service';

describe('AccountService', () => {

    let service: AccountService;
    let toolsService: jasmine.SpyObj<ToolsService>;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [{ provide: ToolsService, useValue: jasmine.createSpyObj('ToolsService', ['getQuery']) }]
        });
        service = TestBed.get(AccountService);
        toolsService = TestBed.get(ToolsService);
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
        toolsService.getQuery.and.returnValue(query);
        service.prepResetPassword(null).subscribe();
        const req = httpTestingController.expectOne(`${service.url}/password/send/token${query}`);
        expect(req.request.method).toEqual('GET');
        expect(toolsService.getQuery).toHaveBeenCalled();
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
        toolsService.getQuery.and.returnValue(query);
        service.confirmEmail(null).subscribe();
        const req = httpTestingController.expectOne(`${service.url}/email/confirm${query}`);
        expect(req.request.method).toEqual('GET');
        expect(toolsService.getQuery).toHaveBeenCalled();
        req.flush(null);
    });
    it('resendConfirmation', () => {
        const query = 'bob';
        toolsService.getQuery.and.returnValue(query);
        service.resendConfirmation(null).subscribe();
        const req = httpTestingController.expectOne(`${service.url}/email/send/token${query}`);
        expect(req.request.method).toEqual('GET');
        expect(toolsService.getQuery).toHaveBeenCalled();
        req.flush(null);
    });
});
