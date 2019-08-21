import { ListRange } from '@angular/cdk/collections';
import { BehaviorSubject, of, Subject, Subscription } from 'rxjs';
import { InfiniteSource } from './infinite-source';

describe('InfiniteSource', () => {

    let base: InfiniteSource<object>;

    beforeEach(() => {
        base = new InfiniteSource();
    });

    it('subscription instanceof Subscription', () => {
        expect(base.subscription instanceof Subscription).toEqual(true);
    });
    it('stream instanceof BehaviorSubject', () => {
        expect(base.stream instanceof BehaviorSubject).toEqual(true);
    });
    it('emitter instanceof Subject', () => {
        expect(base.emitter instanceof Subject).toEqual(true);
    });
    it('connect', () => {
        spyOn(base, 'emit');
        const end = 10;
        const viewChange = of({ end } as ListRange);
        base.stream.next(Array.from({ length: 10 }));
        base.connect({ viewChange }).subscribe();
        expect(base.emit).toHaveBeenCalledWith(end);
        base.disconnect();
    });
    it('disconnect', () => {
        base.disconnect();
        expect(base.subscription.closed).toEqual(true);
    });

    describe('update', () => {

        it('should call stream.next', () => {
            spyOn(base.stream, 'next');
            const items = [{}];
            base.update(items);
            expect(base.stream.next).toHaveBeenCalledWith(items);
        });
        it('should not call stream.next', () => {
            spyOn(base.stream, 'next');
            const items = undefined;
            base.update(items);
            expect(base.stream.next).toHaveBeenCalledWith(items);
        });
    });

    it('emit', () => {
        spyOn(base.emitter, 'next');
        const end = 56;
        base.emit(end);
        expect(base.emitter.next).toHaveBeenCalledWith(end);
    });
});
