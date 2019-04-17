import { Inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import * as UIActions from './actions';
import { FileService } from './file.service';
import { FileTypes } from './types';

@Injectable()
export class FileEffects {

    constructor(
        @Inject(Actions) private actions: Actions,
        @Inject(FileService) private fileService: FileService,
        @Inject(MatDialog) private dialog: MatDialog,
    ) { }

    @Effect() createFileRequest = this.actions.pipe(
        ofType<UIActions.UploadFileRequest>(FileTypes.UPLOAD_FILE_REQUEST),
        mergeMap(a => this.fileService.upload(a.payload).pipe(
            map(r => new UIActions.UploadFileSuccess(r)),
            catchError(e => of(new UIActions.UploadFileError(e.error)))
        ))
    );

    @Effect() getFilesRequest = this.actions.pipe(
        ofType<UIActions.GetFilesRequest>(FileTypes.GET_FILES_REQUEST),
        mergeMap(a => this.fileService.getFiles({ ...a.payload, count: 10 }).pipe(
            map(r => new UIActions.GetFilesSuccess(r)),
            catchError(e => of(new UIActions.GetFilesError(e.error)))
        ))
    );

    @Effect() deleteFileRequest = this.actions.pipe(
        ofType<UIActions.DeleteFileRequest>(FileTypes.DELETE_FILE_REQUEST),
        mergeMap(a => this.fileService.delete(a.payload).pipe(
            map(() => new UIActions.DeleteFileSuccess(a.payload)),
            catchError(e => of(new UIActions.DeleteFileError(e.error)))
        ))
    );

    @Effect({ dispatch: false }) selectFile = this.actions.pipe(
        ofType<UIActions.SelectFile>(FileTypes.SELECT_FILE),
        tap(() => this.dialog.closeAll())
    );
}