import { Inject, Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, filter, map, mergeMap, withLatestFrom } from 'rxjs/operators';
import { BlogConfig } from '../../../shared/blog-config';
import { RootBlogStore } from '../../reducers';
import * as UIActions from './actions';
import { FileService } from './file.service';
import { selectSelectedFile } from './selectors';
import { FileTypes } from './types';

@Injectable()
export class FileEffects {

    constructor(
        @Inject(Actions) private actions: Actions,
        @Inject(FileService) private fileService: FileService,
        @Inject(BlogConfig) private options: BlogConfig,
        @Inject(Store) private state: Store<RootBlogStore>,
    ) { }

    @Effect() uploadFileRequest = this.actions.pipe(
        ofType<UIActions.UploadFileRequest>(FileTypes.UPLOAD_FILE_REQUEST),
        mergeMap(a => this.fileService.upload(a.payload).pipe(
            map(r => new UIActions.UploadFileSuccess(r)),
            catchError(e => of(new UIActions.UploadFileError(e)))
        ))
    );

    @Effect() getFilesRequest = this.actions.pipe(
        ofType<UIActions.GetFilesRequest>(FileTypes.GET_FILES_REQUEST),
        mergeMap(a => this.fileService.getFiles({ ...a.payload, count: this.options.count }).pipe(
            map(r => new UIActions.GetFilesSuccess(r)),
            catchError(e => of(new UIActions.GetFilesError(e)))
        ))
    );

    @Effect() getFilesSuccess = this.actions.pipe(
        ofType<UIActions.GetFilesSuccess>(FileTypes.GET_FILES_SUCCESS),
        withLatestFrom(this.state.select(selectSelectedFile)),
        filter(([a, x]) => a.success.items.length > 0 && !x),
        map(([a]) => new UIActions.SelectFile(a.success.items[0]))
    );

    @Effect() deleteFileRequest = this.actions.pipe(
        ofType<UIActions.DeleteFileRequest>(FileTypes.DELETE_FILE_REQUEST),
        mergeMap(a => this.fileService.delete(a.payload).pipe(
            map(() => new UIActions.DeleteFileSuccess(a.payload)),
            catchError(e => of(new UIActions.DeleteFileError(e)))
        ))
    );
}
