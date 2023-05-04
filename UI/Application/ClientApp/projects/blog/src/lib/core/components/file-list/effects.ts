import { Inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, filter, map, mergeMap, tap, withLatestFrom } from 'rxjs/operators';
import { BlogConfig } from '../../../shared/blog-config';
import { RootBlogStore } from '../../reducers';
import { PromptDialogComponent } from '../prompt-dialog/prompt-dialog.component';
import * as UIActions from './actions';
import { FileService } from './file.service';
import { selectFileTotal, selectFileTotalAmount, selectSelectedFile } from './selectors';
import { FileTypes } from './types';

@Injectable()
export class FileEffects {

    constructor(
        @Inject(Actions) private actions: Actions,
        @Inject(FileService) private fileService: FileService,
        @Inject(BlogConfig) private options: BlogConfig,
        @Inject(Store) private store: Store<RootBlogStore>,
        @Inject(MatDialog) private dialog: MatDialog,
    ) { }

     uploadFileRequest = createEffect(() => this.actions.pipe(
        ofType<UIActions.UploadFileRequest>(FileTypes.UPLOAD_FILE_REQUEST),
        mergeMap(a => this.fileService.upload(a.payload).pipe(
            map(r => new UIActions.UploadFileSuccess(r)),
            catchError(e => of(new UIActions.UploadFileError(e)))
        ))
    ));

     getFilesRequest = createEffect(() => this.actions.pipe(
        ofType<UIActions.GetFilesRequest>(FileTypes.GET_FILES_REQUEST),
        mergeMap(a => this.fileService.getFiles({ ...a.payload, count: this.options.count }).pipe(
            map(r => new UIActions.GetFilesSuccess(r)),
            catchError(e => of(new UIActions.GetFilesError(e)))
        ))
    ));

     getFilesSuccess = createEffect(() => this.actions.pipe(
        ofType<UIActions.GetFilesSuccess>(FileTypes.GET_FILES_SUCCESS),
        withLatestFrom(this.store.select(selectSelectedFile)),
        filter(([a, x]) => a.success.items.length > 0 && !x),
        map(([a]) => new UIActions.SelectFile(a.success.items[0]))
    ));

     deleteFilePreRequest = createEffect(() => this.actions.pipe(
        ofType<UIActions.DeleteFilePreRequest>(FileTypes.DELETE_FILE_PRE_REQUEST),
        map(action => ({ ref: this.dialog.open(PromptDialogComponent), action })),
        tap(x => x.ref.componentInstance.setContent('Are you sure you want to delete this file?')),
        mergeMap(x => x.ref.afterClosed().pipe(
            filter(z => z),
            map(() => new UIActions.DeleteFileRequest(x.action.payload)),
        ))
    ));

     deleteFileRequest = createEffect(() => this.actions.pipe(
        ofType<UIActions.DeleteFileRequest>(FileTypes.DELETE_FILE_REQUEST),
        mergeMap(a => this.fileService.delete(a.payload).pipe(
            map(() => new UIActions.DeleteFileSuccess(a.payload)),
            catchError(e => of(new UIActions.DeleteFileError(e)))
        ))
    ));

     deleteFileSuccess = createEffect(() => this.actions.pipe(
        ofType<UIActions.DeleteFileSuccess>(FileTypes.DELETE_FILE_SUCCESS),
        withLatestFrom(this.store.select(selectFileTotalAmount), this.store.select(selectFileTotal)),
        filter(([_a, totalAmount, total]) => totalAmount > this.options.count && total < this.options.count),
        map(() => new UIActions.GetFilesRequest({ index: 0 })),
    ));
}
