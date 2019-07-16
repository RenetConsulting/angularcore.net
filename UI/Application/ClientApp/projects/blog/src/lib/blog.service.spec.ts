import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NgxHttpParamsService } from '@renet-consulting/ngx-http-params';
import { BlogService } from './blog.service';

describe('BlogService', () => {

    let service: BlogService;

    let controller: HttpTestingController;
    let params: jasmine.SpyObj<NgxHttpParamsService>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                { provide: NgxHttpParamsService, useValue: jasmine.createSpyObj<NgxHttpParamsService>('NgxHttpParamsService', ['map']) }
            ]
        });

        service = TestBed.get(BlogService);
        controller = TestBed.get(HttpTestingController);
        params = TestBed.get(NgxHttpParamsService);

        params.map.and.returnValue(null);
    });

    afterEach(() => controller.verify());

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('create', () => {
        service.create(null).subscribe();
        const req = controller.expectOne(`${service.url}`);
        expect(req.request.method).toEqual('POST');
        req.flush(null);
    });
    it('getBlogs', () => {
        service.getBlogs(null).subscribe();
        const req = controller.expectOne(`${service.url}`);
        expect(req.request.method).toEqual('GET');
        expect(params.map).toHaveBeenCalled();
        req.flush(null);
    });
    it('getBlog', () => {
        const id = 'bob';
        service.getBlog(id).subscribe();
        const req = controller.expectOne(`${service.url}/${id}`);
        expect(req.request.method).toEqual('GET');
        req.flush(null);
    });
    it('update', () => {
        service.update(null).subscribe();
        const req = controller.expectOne(`${service.url}`);
        expect(req.request.method).toEqual('PATCH');
        req.flush(null);
    });
    it('delete', () => {
        const id = 'bob';
        service.delete(id).subscribe();
        const req = controller.expectOne(`${service.url}/${id}`);
        expect(req.request.method).toEqual('DELETE');
        req.flush(null);
    });
});
