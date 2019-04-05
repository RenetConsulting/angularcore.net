import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { HTTP_HEADER_NAMES } from '~/enums/http-header-names.type';
import { IUser } from '~/interfaces/user';
import { ToolsService } from '../tools/tools.service';
import { AuthorizationService } from './authorization.service';

describe('AuthorizationService', () => {

    let service: AuthorizationService;
    let toolsService: jasmine.SpyObj<ToolsService>;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [{ provide: ToolsService, useValue: jasmine.createSpyObj('ToolsService', ['getQuery']) }]
        });
        service = TestBed.get(AuthorizationService);
        toolsService = TestBed.get(ToolsService);
        httpTestingController = TestBed.get(HttpTestingController);
    });

    afterEach(() => httpTestingController.verify());

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('signin', () => {
        const query = 'bob';
        const body = 'body';
        const user = {} as IUser;
        toolsService.getQuery.and.returnValues(query, body);
        service.signin(user).subscribe();
        const req = httpTestingController.expectOne(`/connect/token${query}`);
        expect(req.request.method).toEqual('POST');
        expect(req.request.headers.has(HTTP_HEADER_NAMES.allowAnonymous)).toEqual(true);
        expect(req.request.headers.has(HTTP_HEADER_NAMES.allowHttpError)).toEqual(true);
        expect(req.request.headers.has(HTTP_HEADER_NAMES.contentType)).toEqual(true);
        expect(toolsService.getQuery).toHaveBeenCalled();
        req.flush(null);
    });
    it('signup', () => {
        const query = 'bob';
        const body = 'body';
        const user = {} as IUser;
        toolsService.getQuery.and.returnValues(query, body);
        service.signup(user).subscribe();
        const req = httpTestingController.expectOne(`/api/account/register${query}`);
        expect(req.request.method).toEqual('POST');
        expect(req.request.headers.has(HTTP_HEADER_NAMES.allowHttpError)).toEqual(true);
        expect(toolsService.getQuery).toHaveBeenCalled();
        req.flush(null);
    });
    it('signup', () => {
        service.signout().subscribe();
        const req = httpTestingController.expectOne(`/connect/signout`);
        expect(req.request.method).toEqual('DELETE');
        expect(req.request.headers.has(HTTP_HEADER_NAMES.allowExpiredToken)).toEqual(true);
        req.flush(null);
    });
});
