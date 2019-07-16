import { ChangeDetectionStrategy, Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { InfiniteSource } from '@renet-consulting/infinite-source';
import { Subscription } from 'rxjs';
import { filter, map, withLatestFrom } from 'rxjs/operators';
import { RootBlogStore } from '../reducers';
import { DeleteFileRequest, GetFilesRequest, UploadFileRequest } from './actions';
import { FileModel } from './file.model';
import { selectFiles, selectFileTotalAmount } from './selectors';

@Component({
    selector: 'lib-file-list',
    templateUrl: './file-list.component.html',
    styleUrls: ['./file-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileListComponent implements OnInit, OnDestroy {

    @Input() insertImage: (x: string) => void;
    readonly subscription = new Subscription();
    readonly source = new InfiniteSource<FileModel>();

    constructor(
        @Inject(Store) private store: Store<RootBlogStore>
    ) { }

    ngOnInit(): void {
        this.getItems(0);
        this.subscription.add(this.store.select(selectFiles).subscribe(this.source.update));
        this.subscription.add(this.source.emitter.pipe(
            withLatestFrom(this.store.select(selectFileTotalAmount)),
            filter(([end, total]) => end < total),
            map(([end]) => end),
        ).subscribe(this.getItems));
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    trackByFn = (_, x: FileModel) => x.fileId;

    getItems = (index: number) => this.store.dispatch(new GetFilesRequest({ index }));

    onUpload = (x: FileList) => this.store.dispatch(new UploadFileRequest(x));

    onDelete = (x: FileModel) => this.store.dispatch(new DeleteFileRequest(x.fileId));

    onSelect = (x: FileModel) => this.insertImage(x.fileUrl);
}
