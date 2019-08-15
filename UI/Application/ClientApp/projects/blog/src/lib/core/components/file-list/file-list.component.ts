import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { InfiniteSource } from '@renet-consulting/infinite-source';
import { BehaviorSubject, Subscription } from 'rxjs';
import { filter, map, shareReplay, withLatestFrom } from 'rxjs/operators';
import { RootBlogStore } from '../../reducers';
import { DeleteFileRequest, DeleteFiles, GetFilesRequest, SelectFile, UploadFileRequest } from './actions';
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
    readonly itemSize = 200;
    private index: number;
    private total: number;
    /** amount of scrolled items */
    private shift: number;

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
        this.subscription.add(this.viewport.scrolledIndexChange.subscribe(this.setButtonStatus));
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    trackByFn = (_, x: FileModel) => x.fileId;

    getItems = (index: number) => this.store.dispatch(new GetFilesRequest({ index }));

    onUpload = (x: FileList) => this.store.dispatch(new UploadFileRequest(x));

    onDelete = (x: FileModel) => this.store.dispatch(new DeleteFileRequest(x.fileId));

    onSelect = (x: FileModel) => this.store.dispatch(new SelectFile(x));

    setButtonStatus = (index: number): void => {
        this.index = index;
        this.prevDisabled.next(index <= 0);
        this.nextDisabled.next(typeof this.total === 'number' ? index >= this.total : true);
    }

    setTotal = (value: number): void => {
        if (typeof value === 'number') {
            const total = value - this.shift;
            this.total = total < 0 ? 0 : total;

            this.setButtonStatus(this.index);
        }
    }

    prev = (): void => {
        const index = this.index - this.shift;
        this.viewport.scrollToIndex(index < 0 ? 0 : index, 'smooth');
    }

    next = (): void => {
        const index = this.index + this.shift;
        this.viewport.scrollToIndex(index > this.total ? this.total : index, 'smooth');
    }

    onResize = (e: DOMRectReadOnly): void => {
        this.shift = Math.ceil(e.width / this.itemSize);
    }
}
