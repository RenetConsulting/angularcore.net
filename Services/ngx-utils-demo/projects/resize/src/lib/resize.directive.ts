import { Directive, ElementRef, EventEmitter, Inject, Input, NgZone, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ResizeObserverEntry } from './resize-observer-entry';
import { RESIZE_OBSERVER } from './resize-observer.token';

@Directive({
    selector: '[resize]',
})
export class ResizeDirective implements OnInit, OnDestroy {

    @Input() time = 20;
    @Output() readonly resize = new EventEmitter<DOMRectReadOnly>();
    readonly subject = new Subject<ResizeObserverEntry>();
    readonly subscription = new Subscription();
    observer;

    constructor(
        @Inject(RESIZE_OBSERVER) private resizeObserver: any,
        @Inject(ElementRef) private elementRef: ElementRef,
        @Inject(NgZone) private zone: NgZone,
    ) { }

    ngOnInit(): void {
        if (this.resizeObserver) {
            this.observer = new this.resizeObserver(this.subscribe);
            this.observer.observe(this.elementRef.nativeElement);
        }
        this.subscription.add(this.subject.pipe(
            debounceTime(this.time)
        ).subscribe(this.emit));
    }

    ngOnDestroy(): void {
        if (this.observer) {
            this.observer.disconnect();
        }
        this.subscription.unsubscribe();
    }

    subscribe = (entries: Array<ResizeObserverEntry>) => entries.forEach(x => this.subject.next(x));

    emit = (x: ResizeObserverEntry) => this.zone.run(() => this.resize.emit(x.contentRect));
}
