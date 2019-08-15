import { Action } from '@ngrx/store';
import { IRequestList } from '../../request-list';
import { IResponseList } from '../../response-list';
import { FileModel } from './file.model';
import { FileTypes } from './types';

export class UploadFileRequest implements Action {
    readonly type = FileTypes.UPLOAD_FILE_REQUEST;
    constructor(readonly payload: FileList) { }
}
export class UploadFileSuccess implements Action {
    readonly type = FileTypes.UPLOAD_FILE_SUCCESS;
    constructor(readonly success: IResponseList<FileModel>) { }
}
export class UploadFileError implements Action {
    readonly type = FileTypes.UPLOAD_FILE_ERROR;
    constructor(readonly error) { }
}

export class GetFilesRequest implements Action {
    readonly type = FileTypes.GET_FILES_REQUEST;
    constructor(readonly payload: IRequestList) { }
}
export class GetFilesSuccess implements Action {
    readonly type = FileTypes.GET_FILES_SUCCESS;
    constructor(readonly success: IResponseList<FileModel>) { }
}
export class GetFilesError implements Action {
    readonly type = FileTypes.GET_FILES_ERROR;
    constructor(readonly error) { }
}

export class DeleteFileRequest implements Action {
    readonly type = FileTypes.DELETE_FILE_REQUEST;
    constructor(readonly payload: string) { }
}
export class DeleteFileSuccess implements Action {
    readonly type = FileTypes.DELETE_FILE_SUCCESS;
    constructor(readonly payload: string) { }
}
export class DeleteFileError implements Action {
    readonly type = FileTypes.DELETE_FILE_ERROR;
    constructor(readonly error) { }
}

export type FileActionsUnion = UploadFileRequest
    | UploadFileSuccess
    | UploadFileError
    | GetFilesRequest
    | GetFilesSuccess
    | GetFilesError
    | DeleteFileRequest
    | DeleteFileSuccess
    | DeleteFileError;
