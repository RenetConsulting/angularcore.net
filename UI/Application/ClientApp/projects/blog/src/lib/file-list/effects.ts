import { Inject, Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, mergeMap, withLatestFrom } from 'rxjs/operators';
import { IBlogOptions } from '../blog-options';
import { BLOG_DEFAULT_OPTIONS } from '../blog-options.token';
import { selectSelectedBlogId } from '../selectors';
import * as UIActions from './actions';
import { FileService } from './file.service';
import { FileTypes } from './types';
import { RootBlogStore } from '../reducers';

@Injectable()
export class FileEffects {

    constructor(
        @Inject(Actions) private actions: Actions,
        @Inject(FileService) private fileService: FileService,
        @Inject(Store) private store: Store<RootBlogStore>,
        @Inject(BLOG_DEFAULT_OPTIONS) private options: IBlogOptions,
    ) { }

    @Effect() uploadFileRequest = this.actions.pipe(
        ofType<UIActions.UploadFileRequest>(FileTypes.UPLOAD_FILE_REQUEST),
        withLatestFrom(this.store.select(selectSelectedBlogId)),
        mergeMap(([a, blogId]) => this.fileService.upload(blogId, a.payload).pipe(
            map(r => new UIActions.UploadFileSuccess(r)),
            catchError(e => of(new UIActions.UploadFileError(e)))
        ))
    );

    @Effect() getFilesRequest = this.actions.pipe(
        ofType<UIActions.GetFilesRequest>(FileTypes.GET_FILES_REQUEST),
        withLatestFrom(this.store.select(selectSelectedBlogId)),
        mergeMap(([a, blogId]) => this.fileService.getFiles({ ...a.payload, count: this.options.count, blogId }).pipe(
            map(r => new UIActions.GetFilesSuccess(r)),
            catchError(e => of(new UIActions.GetFilesError(e)))
        ))
    );

    @Effect() deleteFileRequest = this.actions.pipe(
        ofType<UIActions.DeleteFileRequest>(FileTypes.DELETE_FILE_REQUEST),
        mergeMap(a => this.fileService.delete(a.payload).pipe(
            map(() => new UIActions.DeleteFileSuccess(a.payload)),
            catchError(e => of(new UIActions.DeleteFileError(e)))
        ))
    );
}
