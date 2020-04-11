import { ElementRef, NgZone } from '@angular/core';
import { ResizeObserverEntry } from './resize-observer-entry';
import { ResizeDirective } from './resize.directive';
import { fakeAsync, tick } from '@angular/core/testing';
import { Subject, Subscription } from 'rxjs';

describe('ResizeDirective', () => {

    let directive: ResizeDirective;

    let resizeObserver: jasmine.Spy;
    let observer: jasmine.SpyObj<any>;
    let zone: jasmine.SpyObj<NgZone>;
    const elementRef = new ElementRef({});

    beforeEach(() => {

        resizeObserver = jasmine.createSpy();
        observer = jasmine.createSpyObj('ResizeObserver', ['observe', 'disconnect']);
        zone = jasmine.createSpyObj<NgZone>('NgZone', ['run']);

        directive = new ResizeDirective(resizeObserver as any, elementRef, zone);
    });

    it('should create', () => {
        expect(directive).toBeTruthy();
    });
    it('time', () => {
        expect(directive.time).toEqual(20);
    });
    it('subject instanceof Subject', () => {
        expect(directive.subject instanceof Subject).toEqual(true);
    });
    it('subscription instanceof Subscription', () => {
        expect(directive.subscription instanceof Subscription).toEqual(true);
    });
    it('ngOnInit', fakeAsync(() => {
        resizeObserver.and.returnValue(observer);
        spyOn(directive, 'emit');

        directive.ngOnInit();
        directive.subject.next(null);

        tick(directive.time);

        expect(resizeObserver).toHaveBeenCalledWith(directive.subscribe);
        expect(directive.observer.observe).toHaveBeenCalledWith(elementRef.nativeElement);
        expect(directive.emit).toHaveBeenCalled();

        directive.ngOnDestroy();
    }));
    it('ngOnDestroy', () => {
        directive.observer = observer;
        directive.ngOnDestroy();
        expect(directive.observer.disconnect).toHaveBeenCalled();
        expect(directive.subscription.closed).toEqual(true);
    });

    describe('with data', () => {

        const contentRect = { width: 1, height: 2 } as DOMRectReadOnly;
        const entry = { contentRect } as Partial<ResizeObserverEntry> as ResizeObserverEntry;

        it('subscribe', () => {
            spyOn(directive.subject, 'next');
            directive.subscribe([entry]);
            expect(directive.subject.next).toHaveBeenCalledWith(entry);
        });
        it('emit', () => {
            zone.run.and.callFake(fn => fn());
            spyOn(directive.resize, 'emit');
            directive.emit(entry);
            expect(directive.resize.emit).toHaveBeenCalledWith(contentRect);
            expect(zone.run).toHaveBeenCalled();
        });
    });
});
