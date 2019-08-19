import { ListRange } from '@angular/cdk/collections';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { InfiniteSource } from '@renet-consulting/infinite-source';
import { isNumber, isNumbers } from '@renet-consulting/util';
import { BehaviorSubject, Subscription } from 'rxjs';
import { filter, map, shareReplay, withLatestFrom } from 'rxjs/operators';
import { RootBlogStore } from '../../reducers';
import { DeleteFilePreRequest, DeleteFiles, GetFilesRequest, SelectFile, UploadFileRequest } from './actions';
import { FileModel } from './file.model';
import { selectFiles, selectFileTotalAmount, selectSelectedFile } from './selectors';

@Component({
    selector: 'lib-file-list',
    templateUrl: './file-list.component.html',
    styleUrls: ['./file-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileListComponent implements OnInit, OnDestroy {

    @ViewChild(CdkVirtualScrollViewport, { static: true }) viewport: CdkVirtualScrollViewport;
    readonly subscription = new Subscription();
    readonly source = new InfiniteSource<FileModel>();
    readonly selected = this.store.select(selectSelectedFile).pipe(shareReplay(1));
    readonly nextDisabled = new BehaviorSubject(null);
    readonly prevDisabled = new BehaviorSubject(null);
    readonly behavior = 'smooth';
    readonly itemSize = 200;
    start: number;
    end: number;
    total: number;
    /** amount of scrolled items */
    shift: number;
    /** prevents an interrupt of scrolling during loading of new items */
    bufferPx: number;

    constructor(
        @Inject(Store) private store: Store<RootBlogStore>,
    ) { }

    ngOnInit(): void {
        this.store.dispatch(new DeleteFiles());
        this.getItems(0);
        this.subscription.add(this.store.select(selectFiles).subscribe(this.source.update));
        this.subscription.add(this.source.emitter.pipe(
            withLatestFrom(this.store.select(selectFileTotalAmount)),
            filter(([end, total]) => end < total),
            map(([end]) => end),
        ).subscribe(this.getItems));
        this.subscription.add(this.store.select(selectFileTotalAmount).subscribe(this.setTotal));
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    trackByFn = (_, x: FileModel) => x.fileId;

    getItems = (index: number) => this.store.dispatch(new GetFilesRequest({ index }));

    onUpload = (x: FileList) => this.store.dispatch(new UploadFileRequest(x));

    onDelete = (x: FileModel) => this.store.dispatch(new DeleteFilePreRequest(x.fileId));

    onSelect = (x: FileModel) => this.store.dispatch(new SelectFile(x));

    setTotal = (x: number): void => {
        if (typeof x === 'number') {
            this.total = x;
            this.viewChange({ start: this.start, end: this.end });
        }
    }

    prev = (): void => {
        if (isNumbers(this.start, this.shift)) {
            const index = this.start - this.shift;
            this.viewport.scrollToIndex(index < 0 ? 0 : index, this.behavior);
        }
    }

    next = (): void => {
        if (isNumbers(this.start, this.shift, this.total)) {
            const index = this.start + this.shift;
            this.viewport.scrollToIndex(index > this.total ? this.total : index, this.behavior);
        }
    }

    onResize = (e: DOMRectReadOnly): void => {
        const shift = e.width / this.itemSize;
        this.shift = Math.floor(shift) || 1;
        this.bufferPx = Math.ceil(shift) * this.itemSize;
        this.viewport.checkViewportSize();
        this.setButtonStatus();
    }

    viewChange = (x: ListRange): void => {
        this.start = x.start;
        this.end = x.end;
        this.setButtonStatus();
    }

    setButtonStatus = (): void => {
        this.setPrev();
        this.setNext();
    }

    setPrev = () => this.prevDisabled.next(isNumber(this.start) ? this.start <= 0 : true);

    setNext = () => this.nextDisabled.next(isNumbers(this.total, this.end, this.shift) && this.total > this.shift
        ? this.end >= this.total : true)
}
