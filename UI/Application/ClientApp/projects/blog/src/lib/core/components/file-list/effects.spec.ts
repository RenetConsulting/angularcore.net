import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { provideMockActions } from '@ngrx/effects/testing';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold, hot } from 'jasmine-marbles';
import { Observable, of, throwError } from 'rxjs';
import { BlogConfig } from '../../../shared/blog-config';
import { RootBlogStore } from '../../reducers';
import { IResponseList } from '../../response-list';
import { PromptDialogComponent } from '../prompt-dialog/prompt-dialog.component';
import * as UIActions from './actions';
import { FileEffects } from './effects';
import { FileModel } from './file.model';
import { FileService } from './file.service';

describe('FileEffects', () => {

    let effects: FileEffects;

    let actions: Observable<any>;
    let fileService: jasmine.SpyObj<FileService>;
    let store: MockStore<RootBlogStore>;
    let dialog: jasmine.SpyObj<MatDialog>;
    let dialogRef: jasmine.SpyObj<MatDialogRef<any>>;
    let promptDialog: jasmine.SpyObj<PromptDialogComponent>;

    beforeEach(() => {

        TestBed.configureTestingModule({
            providers: [
                FileEffects,
                provideMockActions(() => actions),
                provideMockStore({}),
                { provide: FileService, useValue: jasmine.createSpyObj<FileService>('FileService', ['upload', 'getFiles', 'delete']) },
                { provide: BlogConfig, useValue: { count: 10 } },
                { provide: MatDialog, useValue: jasmine.createSpyObj<MatDialog>('MatDialog', ['open']) },
            ],
        });

        effects = TestBed.get(FileEffects);
        fileService = TestBed.get(FileService);
        store = TestBed.get(Store);
        dialog = TestBed.get(MatDialog);
        dialogRef = jasmine.createSpyObj<MatDialogRef<any>>('MatDialogRef', ['afterClosed']);
        promptDialog = jasmine.createSpyObj<PromptDialogComponent>('PromptDialogComponent', ['setContent']);
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

    it('deleteFilePreRequest', () => {
        dialogRef.componentInstance = promptDialog;
        dialog.open.and.returnValue(dialogRef);
        dialogRef.afterClosed.and.returnValue(of(true));
        const action = new UIActions.DeleteFilePreRequest(null);
        const completion = new UIActions.DeleteFileRequest(null);
        const expected = cold('--b', { b: completion });
        actions = hot('--a-', { a: action });
        expect(effects.deleteFilePreRequest).toBeObservable(expected);
        expect(dialog.open).toHaveBeenCalledWith(PromptDialogComponent);
        expect(promptDialog.setContent).toHaveBeenCalledWith('Are you sure you want to delete this file?');
        expect(dialogRef.afterClosed).toHaveBeenCalled();
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

    it('deleteFileSuccess', () => {
        const action = new UIActions.DeleteFileSuccess(null);
        const completion = new UIActions.GetFilesRequest({ index: 0 });
        const expected = cold('--b', { b: completion });

        const file1 = { fileId: '1' } as FileModel;
        const file2 = { fileId: '2' } as FileModel;
        const file3 = { fileId: '3' } as FileModel;
        const file4 = { fileId: '4' } as FileModel;

        store.setState({
            file: {
                ids: [
                    file1.fileId, file2.fileId, file3.fileId, file4.fileId
                ],
                entities: {
                    [file1.fileId]: file1,
                    [file2.fileId]: file2,
                    [file3.fileId]: file3,
                    [file4.fileId]: file4,
                },
                totalAmount: 12
            }
        });
        actions = hot('--a-', { a: action });
        expect(effects.deleteFileSuccess).toBeObservable(expected);
    });
});
