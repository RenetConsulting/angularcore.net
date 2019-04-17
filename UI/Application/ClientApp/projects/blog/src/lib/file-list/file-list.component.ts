import { Component, Inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { RootBlogStore } from '../reducers';
import { DeleteFileRequest, GetFilesRequest, SelectFile, UploadFileRequest } from './actions';
import { FileModel } from './file.model';
import { selectFiles, selectFilesAmount, selectFilesTotal } from './selectors';

@Component({
    selector: 'lib-file-list',
    templateUrl: './file-list.component.html',
    styleUrls: ['./file-list.component.scss']
})
export class FileListComponent implements OnInit {

    items = this.store.select(selectFiles);
    itemsTotal = this.store.select(selectFilesTotal);
    itemsAmount = this.store.select(selectFilesAmount);

    constructor(
        @Inject(Store) private store: Store<RootBlogStore>
    ) { }

    ngOnInit(): void {
        this.getItems(0);
    }

    trackByFn = (_, i: FileModel) => i.fileId;

    getItems = (index: number): void => this.store
        .dispatch(new GetFilesRequest({ index }));

    upload = (items: FileList): void => this.store
        .dispatch(new UploadFileRequest(items));

    delete = (item: FileModel): void => this.store
        .dispatch(new DeleteFileRequest(item.fileId));

    select = (item: FileModel): void => this.store
        .dispatch(new SelectFile(item.fileId));
}
