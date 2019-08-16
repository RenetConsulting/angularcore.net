import { ListRange } from '@angular/cdk/collections';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { ContentChild, Directive, EventEmitter, Inject, Input, NgZone, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Directive({
    selector: 'cdk-virtual-scroll-viewport[viewChange]'
})
export class ViewportChangeDirective implements OnInit, OnDestroy {

    @ContentChild(CdkVirtualScrollViewport, { static: true }) viewport: CdkVirtualScrollViewport;
    @Input() itemSize: number;
    @Input() time = 20;
    @Output() readonly viewChange = new EventEmitter<ListRange>();
    readonly subscription = new Subscription();

    constructor(
        @Inject(NgZone) private zone: NgZone
    ) { }

    ngOnInit(): void {
        this.subscription.add(this.viewport.elementScrolled().pipe(
            debounceTime(this.time)
        ).subscribe(this.onScrolled));
        this.onScrolled();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    onScrolled = (): void => {
        const offset = this.viewport.measureScrollOffset();
        const viewportSize = this.viewport.getViewportSize();
        const start = offset / this.itemSize;
        const end = (offset + viewportSize) / this.itemSize;
        this.zone.run(() => this.viewChange.emit({ start, end }));
    }
}
