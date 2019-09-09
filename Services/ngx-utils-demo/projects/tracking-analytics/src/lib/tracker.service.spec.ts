import { DOCUMENT, ɵPLATFORM_BROWSER_ID } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NgxHttpParamsService } from '@renet-consulting/ngx-http-params';
import { StorageService } from '@renet-consulting/storage';
import { NGX_BASE_URL } from './base-url.token';
import { NgxTrackerHttpFakeService, NgxTrackerHttpService } from './tracker-http.service';
import { TrackerModel } from './tracker.model';
import { NgxTrackerService } from './tracker.service';

describe('NgxTrackerService', () => {

    let service: NgxTrackerService;

    let doc: any = {};
    let params: jasmine.SpyObj<NgxHttpParamsService>;
    let storageService: jasmine.SpyObj<StorageService>;
    const id: any = new Date().valueOf();
    const baseUrl = 'google.com';

    beforeEach(() => {

        TestBed.configureTestingModule({
            imports: [],
            declarations: [],
            providers: [
                NgxTrackerService,
                { provide: NgxTrackerHttpService, useClass: NgxTrackerHttpFakeService },
                { provide: NGX_BASE_URL, useValue: baseUrl },
                { provide: PLATFORM_ID, useValue: ɵPLATFORM_BROWSER_ID },
                { provide: NgxHttpParamsService, useValue: jasmine.createSpyObj<NgxHttpParamsService>('NgxHttpParamsService', ['map']) },
                { provide: StorageService, useValue: jasmine.createSpyObj<StorageService>('StorageService', ['get', 'set']) },
            ]
        }).compileComponents();

        service = TestBed.get(NgxTrackerService);
        doc = TestBed.get(DOCUMENT);
        storageService = TestBed.get(StorageService);
        params = TestBed.get(NgxHttpParamsService);
    });

    it('randomValue', () => {
        expect(service.randomValue).not.toEqual(service.randomValue);
        expect(typeof service.randomValue === 'string').toEqual(true);
        expect(service.randomValue.length > 5).toEqual(true);
    });
    it('clientIdKey', () => {
        expect(service.clientIdKey).toEqual('_ga');
    });
    it('keySize', () => {
        expect(service.keySize).toEqual(16);
    });

    describe('Client ID', () => {

        it('cookie', () => {
            const clientId = '2028930123.1519650559';
            doc.cookie = `_ga=GA1.1.${clientId}`;
            expect(service.cid).toEqual(clientId);
        });
        it('localStorage', () => {
            const randomValue = '2028930123';
            const clientId = `${randomValue}.${randomValue}`;
            doc.cookie = `_ga=GA1.1.${clientId}; expires=${new Date(-new Date().valueOf())}`;
            storageService.get.and.returnValue(null);
            Object.defineProperty(service, 'randomValue', {
                get: () => {
                    return randomValue;
                }
            });
            const result = service.cid;
            expect(result).toEqual(clientId);
            expect(storageService.get).toHaveBeenCalledWith(service.clientIdKey);
            expect(storageService.set).toHaveBeenCalledWith(service.clientIdKey, clientId);
        });
    });

    it('Document Encoding', () => {
        expect(service.de).toEqual('UTF-8');
    });
    it('User Language', () => {
        const language = 'ua';
        Object.defineProperty(window, 'navigator', { get: () => ({ browserLanguage: language }) });
        expect(service.ul).toEqual(language);
    });
    it('Screen Colors', () => {
        const colorDepth = '16';
        Object.defineProperty(window, 'screen', { get: () => ({ colorDepth }) });
        expect(service.sd).toEqual(`${colorDepth}-bit`);
    });
    it('Screen Resolution', () => {
        Object.defineProperty(window, 'screen', { get: () => ({ width: id, height: id }) });
        expect(service.sr).toEqual(`${id}x${id}`);
    });
    it('Viewport size', () => {
        expect(service.vp).toEqual(`${document.documentElement.clientWidth + 'x' + document.documentElement.clientHeight}`);
    });
    it('trackerModel', () => {
        expect(service.trackerModel).toBeDefined(true);
    });
    it('encrypt', () => {
        params.map.and.returnValue(new HttpParams());
        const result = service.encrypt(new TrackerModel(), `${id}`, `${id}`);
        expect(typeof result === 'string').toEqual(true);
        expect(params.map).toHaveBeenCalled();
    });
});
