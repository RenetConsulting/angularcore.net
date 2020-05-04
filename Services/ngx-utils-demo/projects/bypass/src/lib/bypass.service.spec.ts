import { TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { BypassService } from './bypass.service';
import { BYPASS_TOKEN } from './bypass.token';
import { BypassType } from './bypass.type';

describe('BypassService', () => {

    let service: BypassService;

    let type: BypassType;
    let sanitizer: DomSanitizer;
    const value = '<p>bob</p>';

    beforeEach(() => {

        TestBed.configureTestingModule({
            providers: [
                {
                    provide: DomSanitizer,
                    useValue: jasmine.createSpyObj<DomSanitizer>('DomSanitizer', [
                        'bypassSecurityTrustHtml',
                        'bypassSecurityTrustResourceUrl',
                        'bypassSecurityTrustScript',
                        'bypassSecurityTrustStyle',
                        'bypassSecurityTrustUrl',
                    ])
                }
            ]
        });

        service = TestBed.inject(BypassService);
        type = TestBed.inject(BYPASS_TOKEN);
        sanitizer = TestBed.inject(DomSanitizer);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('map', () => {

        beforeEach(() => {

            spyOn(service, 'bypass');
        });

        it('pass nothing, should call with type', () => {
            service.map(value);
            expect(service.bypass).toHaveBeenCalledWith(value, type);
        });
        it('pass undefined, should call with type', () => {
            service.map(value, undefined);
            expect(service.bypass).toHaveBeenCalledWith(value, type);
        });
        it('pass null, should call with null', () => {
            service.map(value, null);
            expect(service.bypass).toHaveBeenCalledWith(value, null);
        });
    });

    describe('bypass', () => {

        it('bypassSecurityTrustHtml', () => {
            service.bypass(value, BypassType.Html);
            expect(sanitizer.bypassSecurityTrustHtml).toHaveBeenCalledWith(value);
        });
        it('bypassSecurityTrustResourceUrl', () => {
            service.bypass(value, BypassType.ResourceUrl);
            expect(sanitizer.bypassSecurityTrustResourceUrl).toHaveBeenCalledWith(value);
        });
        it('bypassSecurityTrustScript', () => {
            service.bypass(value, BypassType.Script);
            expect(sanitizer.bypassSecurityTrustScript).toHaveBeenCalledWith(value);
        });
        it('bypassSecurityTrustStyle', () => {
            service.bypass(value, BypassType.Style);
            expect(sanitizer.bypassSecurityTrustStyle).toHaveBeenCalledWith(value);
        });
        it('bypassSecurityTrustUrl', () => {
            service.bypass(value, BypassType.Url);
            expect(sanitizer.bypassSecurityTrustUrl).toHaveBeenCalledWith(value);
        });
    });
});
