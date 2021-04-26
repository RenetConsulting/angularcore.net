import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { IPerson } from '~/interfaces/person';
import { PersonService } from './person.service';

describe('PersonService', () => {

    let service: PersonService;

    let controller: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
        });

        service = TestBed.inject(PersonService);
        controller = TestBed.inject(HttpTestingController);
    });

    afterEach(() => controller.verify());

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('getProfile', () => {
        service.getProfile().subscribe();
        const req = controller.expectOne(`${service.url}/profile`);
        expect(req.request.method).toEqual('GET');
        req.flush(null);
    });
    it('update', () => {
        const profile = {} as IPerson;
        service.update(profile).subscribe();
        const req = controller.expectOne(`${service.url}`);
        expect(req.request.method).toEqual('PUT');
        expect(req.request.body).toEqual(profile);
        req.flush(null);
    });
});
