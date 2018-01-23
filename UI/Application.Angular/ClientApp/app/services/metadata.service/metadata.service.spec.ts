/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />

import { TestBed, getTestBed } from '@angular/core/testing';
import { NavigationEnd, ActivatedRouteSnapshot, Event } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { MetadataService } from '../services';

describe('Service: MetadataService', () => {

    let service: MetadataService;

    let injector: TestBed;
    let metaService: Meta;
    let titleService: Title;
    let snapshot: ActivatedRouteSnapshot;
    const event: Event = new NavigationEnd(1, 'any', 'otherAny');

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                MetadataService
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        injector = getTestBed();
        service = injector.get(MetadataService);
        metaService = injector.get(Meta);
        titleService = injector.get(Title);
        snapshot = {
            data: { title: 'title', meta: ['meta'] }
        } as any;
    })

    describe('methods', () => {
        describe('setMetadata', () => {
            it('the method has to set title from date', () => {
                spyOn(titleService, 'setTitle');
                spyOn(metaService, 'updateTag');
                service.setMetadata(event, snapshot);
                expect(titleService.setTitle).toHaveBeenCalledWith(snapshot.data.title);
                expect(metaService.updateTag).toHaveBeenCalledWith(snapshot.data.meta[0]);
            });
            it('the method has to set defaultTitle', () => {
                spyOn(titleService, 'setTitle');
                spyOn(metaService, 'updateTag');
                snapshot.data.title = null;
                service.setMetadata(event, snapshot);
                expect(titleService.setTitle).toHaveBeenCalledWith(service.defaultTitle);
                expect(metaService.updateTag).toHaveBeenCalledWith(snapshot.data.meta[0]);
            });
        });
    });
});
