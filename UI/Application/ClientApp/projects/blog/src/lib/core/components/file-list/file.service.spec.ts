import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NgxHttpParamsService } from '@renet-consulting/ngx-http-params';
import { FileService } from './file.service';

describe('FileService', () => {

    let service: FileService;

    let controller: HttpTestingController;
    let params: jasmine.SpyObj<NgxHttpParamsService>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                { provide: NgxHttpParamsService, useValue: jasmine.createSpyObj<NgxHttpParamsService>('NgxHttpParamsService', ['map']) }
            ]
        });

        service = TestBed.inject(FileService);
        controller = TestBed.inject(HttpTestingController);
        params = TestBed.inject(NgxHttpParamsService as any);

        params.map.and.returnValue(null);
    });

    afterEach(() => controller.verify());

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('create', () => {
        service.upload([] as Partial<FileList> as FileList).subscribe();
        const req = controller.expectOne(`${service.url}`);
        expect(req.request.method).toEqual('POST');
        req.flush(null);
    });
    it('getFiles', () => {
        service.getFiles(null).subscribe();
        const req = controller.expectOne(`${service.url}`);
        expect(req.request.method).toEqual('GET');
        expect(params.map).toHaveBeenCalled();
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
