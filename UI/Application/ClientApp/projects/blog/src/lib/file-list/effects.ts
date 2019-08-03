import { Inject, Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { BlogDefaultOptions } from '../blog-default-options';
import * as UIActions from './actions';
import { FileService } from './file.service';
import { FileTypes } from './types';

@Injectable()
export class FileEffects {

    constructor(
        @Inject(Actions) private actions: Actions,
        @Inject(FileService) private fileService: FileService,
        @Inject(BlogDefaultOptions) private options: BlogDefaultOptions,
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

    @Effect() deleteFileRequest = this.actions.pipe(
        ofType<UIActions.DeleteFileRequest>(FileTypes.DELETE_FILE_REQUEST),
        mergeMap(a => this.fileService.delete(a.payload).pipe(
            map(() => new UIActions.DeleteFileSuccess(a.payload)),
            catchError(e => of(new UIActions.DeleteFileError(e)))
        ))
    );
}
