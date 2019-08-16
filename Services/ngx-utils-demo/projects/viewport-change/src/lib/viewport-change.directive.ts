import { ListRange } from '@angular/cdk/collections';
import { CdkVirtualForOf, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { ContentChild, Directive, EventEmitter, Inject, Input, NgZone, OnDestroy, OnInit, Output } from '@angular/core';
import { merge, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Directive({
    selector: 'cdk-virtual-scroll-viewport[viewChange]'
})
export class ViewportChangeDirective implements OnInit, OnDestroy {

    @ContentChild(CdkVirtualScrollViewport, { static: true }) viewport: CdkVirtualScrollViewport;
    @ContentChild(CdkVirtualForOf, { static: true }) forOf: CdkVirtualForOf<any>;
    @Input() itemSize: number;
    @Input() time = 20;
    @Output() readonly viewChange = new EventEmitter<ListRange>();
    readonly subscription = new Subscription();

    constructor(
        @Inject(NgZone) private zone: NgZone
    ) { }

    ngOnInit(): void {
        this.subscription.add(merge(this.forOf.dataStream, this.viewport.elementScrolled()).pipe(
            debounceTime(this.time)
        ).subscribe(this.emitViewChange));
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    emitViewChange = (): void => {
        const offset = this.viewport.measureScrollOffset();
        const viewportSize = this.viewport.getViewportSize();
        const start = offset / this.itemSize;
        const end = (offset + viewportSize) / this.itemSize;
        this.zone.run(() => this.viewChange.emit({ start, end }));
    }
}
