import { Directive, ElementRef, EventEmitter, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { RESIZE_OBSERVER } from './resize-observer.token';

@Directive({
    selector: '[resize]',
})
export class ResizeDirective implements OnInit, OnDestroy {

    @Output() readonly resize = new EventEmitter<DOMRectReadOnly>();
    observer: ResizeObserver;

    constructor(
        @Inject(RESIZE_OBSERVER) private resizeObserver: any,
        @Inject(ElementRef) private elementRef: ElementRef,
    ) { }

    ngOnInit(): void {
        this.observer = new this.resizeObserver(this.subscribe);
        this.observer.observe(this.elementRef.nativeElement);
    }

    ngOnDestroy(): void {
        this.observer.disconnect();
    }

    subscribe = (entries: Array<ResizeObserverEntry>) => entries.forEach(x => this.resize.emit(x.contentRect as DOMRectReadOnly));
}
