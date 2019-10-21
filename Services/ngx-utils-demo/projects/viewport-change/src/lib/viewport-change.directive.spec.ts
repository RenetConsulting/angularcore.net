import { CdkVirtualForOf, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { EventEmitter, NgZone } from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';
import { of, Subscription } from 'rxjs';
import { ViewportChangeDirective } from './viewport-change.directive';

describe('ViewportChangeDirective', () => {

    let directive: ViewportChangeDirective;

    let zone: jasmine.SpyObj<NgZone>;
    let viewport: jasmine.SpyObj<CdkVirtualScrollViewport>;

    beforeEach(() => {

        zone = jasmine.createSpyObj<NgZone>('NgZone', ['run']);
        viewport = jasmine.createSpyObj<CdkVirtualScrollViewport>('CdkVirtualScrollViewport', [
            'elementScrolled',
            'measureScrollOffset',
            'getViewportSize'
        ]);

        directive = new ViewportChangeDirective(zone);
        directive.viewport = viewport;
    });

    it('should create', () => {
        expect(directive).toBeTruthy();
    });
    it('time === 20', () => {
        expect(directive.time).toEqual(20);
    });
    it('viewChange', () => {
        expect(directive.viewChange instanceof EventEmitter).toEqual(true);
    });
    it('subscription', () => {
        expect(directive.subscription instanceof Subscription).toEqual(true);
    });

    describe('ngOnInit', () => {

        beforeEach(() => {
            spyOn(directive, 'emit');
            viewport.elementScrolled.and.returnValue(of(null));
        });

        it('with forOf (3 source of data)', fakeAsync(() => {
            directive.forOf = { dataStream: of(null) } as CdkVirtualForOf<any>;
            directive.ngOnInit();

            tick(directive.time);

            expect(viewport.elementScrolled).toHaveBeenCalled();
            expect(directive.emit).toHaveBeenCalledTimes(1);
        }));
        it('without', fakeAsync(() => {
            directive.ngOnInit();

            tick(directive.time);

            expect(viewport.elementScrolled).toHaveBeenCalled();
            expect(directive.emit).toHaveBeenCalledTimes(1);
        }));

        afterEach(() => directive.ngOnDestroy());
    });

    it('ngOnDestroy', () => {
        directive.ngOnDestroy();
        expect(directive.subscription.closed).toEqual(true);
    });
    it('emitViewChange', () => {
        spyOn(directive.viewChange, 'emit');
        zone.run.and.callFake(fn => fn());
        viewport.measureScrollOffset.and.returnValue(2500);
        viewport.getViewportSize.and.returnValue(900);

        const start = 12.5;
        const end = 17;
        directive.itemSize = 200;

        directive.emit();

        expect(directive.viewChange.emit).toHaveBeenCalledWith({ start, end });
    });
});
