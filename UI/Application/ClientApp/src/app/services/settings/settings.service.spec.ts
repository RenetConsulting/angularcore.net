import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SettingsService } from './settings.service';

describe('SettingsService', () => {

    let service: SettingsService;

    let controller: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
        });

        service = TestBed.get(SettingsService);
        controller = TestBed.get(HttpTestingController);
    });

    afterEach(() => controller.verify());

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('url', () => {
        expect(service.url).toEqual('/api/settings');
    });
    it('changePassword', () => {
        service.get().subscribe();
        const req = controller.expectOne(`${service.url}`);
        expect(req.request.method).toEqual('GET');
        req.flush(null);
    });
});
