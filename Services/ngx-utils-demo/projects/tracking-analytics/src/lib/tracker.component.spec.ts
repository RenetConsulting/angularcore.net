import { ɵPLATFORM_BROWSER_ID } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { merge, of } from 'rxjs';
import { NGX_BASE_URL } from './base-url.token';
import { NgxTrackerHttpService } from './tracker-http.service';
import { NgxTrackerComponent } from './tracker.component';
import { TrackerModel } from './tracker.model';
import { NgxTrackerModule } from './tracker.module';
import { NgxTrackerService } from './tracker.service';

describe('NgxTrackerComponent', () => {

    let component: NgxTrackerComponent;

    let trackerHttpService: jasmine.SpyObj<NgxTrackerHttpService>;
    let trackerService: NgxTrackerService;
    let router: jasmine.SpyObj<Router>;
    let title: Title;
    const baseUrl = 'google.com';

    beforeEach(() => {

        TestBed.configureTestingModule({
            imports: [NgxTrackerModule.forRoot({})],
            providers: [
                { provide: NgxTrackerService, useValue: {} },
                {
                    provide: NgxTrackerHttpService,
                    useValue: jasmine.createSpyObj<NgxTrackerHttpService>('NgxTrackerHttpService', ['addTracker'])
                },
                { provide: Router, useValue: jasmine.createSpyObj<Router>('Router', ['navigate']) },
                { provide: NGX_BASE_URL, useValue: baseUrl },
                { provide: PLATFORM_ID, useValue: ɵPLATFORM_BROWSER_ID }
            ]
        });

        title = TestBed.inject(Title);
        trackerHttpService = TestBed.inject(NgxTrackerHttpService) as jasmine.SpyObj<NgxTrackerHttpService>;
        trackerService = TestBed.inject(NgxTrackerService);
        router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
        component = TestBed.createComponent(NgxTrackerComponent).componentInstance;
    });

    it('toBeDefined', () => {
        expect(component).toBeDefined();
    });
    it('url', () => {
        expect(component.url).toEqual(null);
    });
    it('ngOnInit', () => {
        spyOn(component, 'getReferer');
        spyOn(component, 'setUrl');
        spyOn(component, 'setTracker');
        const navigationStart = new NavigationStart(null, null);
        const navigationEnd = new NavigationEnd(null, null, null);
        Object.defineProperty(router, 'events', { get: () => merge(of(navigationStart), of(navigationEnd)) });
        component.ngOnInit();
        expect(component.getReferer).toHaveBeenCalled();
        expect(component.setUrl).toHaveBeenCalled();
        expect(component.setTracker).toHaveBeenCalledWith(router.url);
        component.ngOnDestroy();
    });
    it('ngOnDestroy', () => {
        component.ngOnDestroy();
        expect(component.subscription.closed).toEqual(true);
    });
    it('setTracker', () => {
        Object.defineProperty(trackerService, 'trackerModel', { get: () => new TrackerModel() });
        const dt = 'bob';
        const item: TrackerModel = {
            ...trackerService.trackerModel,
            dl: `${baseUrl}${router.url}`,
            dp: router.url,
            dr: component.url,
            dt
        };
        spyOn(title, 'getTitle').and.returnValue(dt);
        trackerHttpService.addTracker.and.returnValue(of(null));
        component.setTracker(router.url);
        expect(title.getTitle).toHaveBeenCalled();
        expect(trackerHttpService.addTracker).toHaveBeenCalledWith(item);
        expect(component.url).toEqual(null);
    });
    it('setUrl', () => {
        component.setUrl();
        expect(component.url).toEqual(`${baseUrl}${router.url}`);
    });
    it('getReferer', () => {
        component.getReferer();
        expect(component.url).toEqual(document.referrer);
    });
});
