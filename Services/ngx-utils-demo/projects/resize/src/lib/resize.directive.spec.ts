import { ElementRef, NgZone } from '@angular/core';
import { ResizeDirective } from './resize.directive';

describe('ResizeDirective', () => {

    let directive: ResizeDirective;

    let resizeObserverFn: jasmine.Spy;
    let resizeObserver: jasmine.SpyObj<ResizeObserver>;
    let zone: jasmine.SpyObj<NgZone>;
    const elementRef = new ElementRef({});

    beforeEach(() => {

        resizeObserverFn = jasmine.createSpy();
        resizeObserver = jasmine.createSpyObj<ResizeObserver>('ResizeObserver', ['observe', 'disconnect']);
        zone = jasmine.createSpyObj<NgZone>('NgZone', ['run']);

        directive = new ResizeDirective(resizeObserverFn as any, elementRef, zone);
    });

    it('should create', () => {
        expect(directive).toBeTruthy();
    });
    it('ngOnInit', () => {
        resizeObserverFn.and.returnValue(resizeObserver);
        directive.ngOnInit();
        expect(resizeObserverFn).toHaveBeenCalledWith(directive.subscribe);
        expect(directive.observer.observe).toHaveBeenCalledWith(elementRef.nativeElement);
    });
    it('ngOnDestroy', () => {
        directive.observer = resizeObserver;
        directive.ngOnDestroy();
        expect(directive.observer.disconnect).toHaveBeenCalled();
    });
    it('subscribe', () => {
        zone.run.and.callFake(fn => fn());
        spyOn(directive.resize, 'emit');
        const contentRect = {} as DOMRectReadOnly;
        const entry = { contentRect } as Partial<ResizeObserverEntry> as ResizeObserverEntry;
        directive.subscribe([entry]);
        expect(directive.resize.emit).toHaveBeenCalledWith(entry.contentRect);
        expect(zone.run).toHaveBeenCalled();
    });
});
