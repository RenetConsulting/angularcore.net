import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot } from 'jasmine-marbles';
import { Observable, of, throwError } from 'rxjs';
import { IResponseList } from '../../response-list';
import * as UIActions from './actions';
import { FileEffects } from './effects';
import { FileModel } from './file.model';
import { FileService } from './file.service';

describe('FileEffects', () => {

    let effects: FileEffects;

    let actions: Observable<any>;
    let fileService: jasmine.SpyObj<FileService>;

    beforeEach(() => {

        TestBed.configureTestingModule({
            providers: [
                FileEffects,
                provideMockActions(() => actions),
                { provide: FileService, useValue: jasmine.createSpyObj<FileService>('FileService', ['upload', 'getFiles', 'delete']) },
            ],
        });

        effects = TestBed.get(FileEffects);
        fileService = TestBed.get(FileService);
    });

    it('should work', () => {
        expect(effects).toBeDefined();
    });

    describe('uploadFileRequest', () => {

        const item = {} as FileModel;
        const response = { items: [item] } as IResponseList<FileModel>;

        it('success', () => {
            fileService.upload.and.returnValue(of(response));
            const action = new UIActions.UploadFileRequest(null);
            const completion = new UIActions.UploadFileSuccess(response);
            const expected = cold('--b', { b: completion });
            actions = hot('--a-', { a: action });
            expect(effects.uploadFileRequest).toBeObservable(expected);
        });
        it('error', () => {
            const error = 'bob';
            fileService.upload.and.returnValue(throwError(error));
            const action = new UIActions.UploadFileRequest(null);
            const completion = new UIActions.UploadFileError(error);
            const expected = cold('--b', { b: completion });
            actions = hot('--a-', { a: action });
            expect(effects.uploadFileRequest).toBeObservable(expected);
        });
    });

    describe('getFilesRequest', () => {

        it('success', () => {
            fileService.getFiles.and.returnValue(of(null));
            const action = new UIActions.GetFilesRequest(null);
            const completion = new UIActions.GetFilesSuccess(null);
            const expected = cold('--b', { b: completion });
            actions = hot('--a-', { a: action });
            expect(effects.getFilesRequest).toBeObservable(expected);
        });
        it('error', () => {
            const error = 'bob';
            fileService.getFiles.and.returnValue(throwError(error));
            const action = new UIActions.GetFilesRequest(null);
            const completion = new UIActions.GetFilesError(error);
            const expected = cold('--b', { b: completion });
            actions = hot('--a-', { a: action });
            expect(effects.getFilesRequest).toBeObservable(expected);
        });
    });

    describe('deleteFileRequest', () => {

        it('success', () => {
            fileService.delete.and.returnValue(of(null));
            const action = new UIActions.DeleteFileRequest(null);
            const completion = new UIActions.DeleteFileSuccess(null);
            const expected = cold('--b', { b: completion });
            actions = hot('--a-', { a: action });
            expect(effects.deleteFileRequest).toBeObservable(expected);
        });
        it('error', () => {
            const error = 'bob';
            fileService.delete.and.returnValue(throwError(error));
            const action = new UIActions.DeleteFileRequest(null);
            const completion = new UIActions.DeleteFileError(error);
            const expected = cold('--b', { b: completion });
            actions = hot('--a-', { a: action });
            expect(effects.deleteFileRequest).toBeObservable(expected);
        });
    });
});
