import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';

export class InfiniteSource<ItemType> extends DataSource<ItemType> {

    readonly stream = new BehaviorSubject<Array<ItemType>>([]);
    /** emits the end of the view range */
    readonly emitter = new Subject<number>();
    readonly subscription = new Subscription();

    connect(collectionViewer: CollectionViewer): Observable<Array<ItemType>> {
        this.subscription.add(collectionViewer.viewChange.subscribe(({ end }) => end === this.stream.getValue().length && this.emit(end)));
        return this.stream;
    }

    disconnect(): void {
        this.subscription.unsubscribe();
    }

    update = (items: Array<ItemType>) => Array.isArray(items) && this.stream.next(items);

    emit = (end: number) => this.emitter.next(end);
}
