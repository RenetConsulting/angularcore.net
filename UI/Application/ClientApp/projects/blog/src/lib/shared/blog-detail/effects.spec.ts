import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot } from 'jasmine-marbles';
import { Observable, of, throwError } from 'rxjs';
import * as UIActions from '../../core/actions';
import { PromptDialogComponent } from '../../core/components/prompt-dialog/prompt-dialog.component';
import { BlogService } from '../../core/services/blog.service';
import { BlogDetailEffects } from './effects';

describe('BlogDetailEffects', () => {

    let effects: BlogDetailEffects;

    let actions: Observable<any>;
    let blogService: jasmine.SpyObj<BlogService>;
    let router: jasmine.SpyObj<Router>;
    let dialog: jasmine.SpyObj<MatDialog>;
    let dialogRef: jasmine.SpyObj<MatDialogRef<any>>;
    let promptDialog: jasmine.SpyObj<PromptDialogComponent>;

    beforeEach(() => {

        TestBed.configureTestingModule({
            providers: [
                BlogDetailEffects,
                provideMockActions(() => actions),
                {
                    provide: BlogService, useValue: jasmine.createSpyObj<BlogService>('BlogService', [
                        'getBlog',
                        'update',
                        'delete'
                    ])
                },
                { provide: MatSnackBar, useValue: jasmine.createSpyObj<MatSnackBar>('MatSnackBar', ['openFromComponent']) },
                { provide: Router, useValue: jasmine.createSpyObj<Router>('Router', ['navigate']) },
                { provide: MatDialog, useValue: jasmine.createSpyObj<MatDialog>('MatDialog', ['open']) },
            ],
        });

        effects = TestBed.get(BlogDetailEffects);
        blogService = TestBed.get(BlogService);
        router = TestBed.get(Router);
        dialog = TestBed.get(MatDialog);
        dialogRef = jasmine.createSpyObj<MatDialogRef<any>>('MatDialogRef', ['afterClosed']);
        promptDialog = jasmine.createSpyObj<PromptDialogComponent>('PromptDialogComponent', ['setContent']);
    });

    it('should work', () => {
        expect(effects).toBeDefined();
    });

    describe('getBlogRequest', () => {

        it('success', () => {
            blogService.getBlog.and.returnValue(of(null));
            const action = new UIActions.GetBlogRequest(null);
            const completion = new UIActions.GetBlogSuccess(null);
            const expected = cold('--b', { b: completion });
            actions = hot('--a-', { a: action });
            expect(effects.getBlogRequest).toBeObservable(expected);
        });
        it('error', () => {
            const error = 'bob';
            blogService.getBlog.and.returnValue(throwError(error));
            const action = new UIActions.GetBlogRequest(null);
            const completion = new UIActions.GetBlogError(error);
            const expected = cold('--b', { b: completion });
            actions = hot('--a-', { a: action });
            expect(effects.getBlogRequest).toBeObservable(expected);
        });
    });

    describe('updateBlogRequest', () => {

        it('success', () => {
            blogService.update.and.returnValue(of(null));
            const action = new UIActions.UpdateBlogRequest(null);
            const completion = new UIActions.UpdateBlogSuccess(null);
            const expected = cold('--b', { b: completion });
            actions = hot('--a-', { a: action });
            expect(effects.updateBlogRequest).toBeObservable(expected);
        });
        it('error', () => {
            const error = 'bob';
            blogService.update.and.returnValue(throwError(error));
            const action = new UIActions.UpdateBlogRequest(null);
            const completion = new UIActions.UpdateBlogError(error);
            const expected = cold('--b', { b: completion });
            actions = hot('--a-', { a: action });
            expect(effects.updateBlogRequest).toBeObservable(expected);
        });
    });

    it('deleteBlogPreRequest', () => {
        dialogRef.componentInstance = promptDialog;
        dialog.open.and.returnValue(dialogRef);
        dialogRef.afterClosed.and.returnValue(of(true));
        const action = new UIActions.DeleteBlogPreRequest(null);
        const completion = new UIActions.DeleteBlogRequest(null);
        const expected = cold('--b', { b: completion });
        actions = hot('--a-', { a: action });
        expect(effects.deleteBlogPreRequest).toBeObservable(expected);
        expect(dialog.open).toHaveBeenCalledWith(PromptDialogComponent);
        expect(promptDialog.setContent).toHaveBeenCalledWith('Are you sure you want to delete this blog?');
        expect(dialogRef.afterClosed).toHaveBeenCalled();
    });

    describe('deleteBlogRequest', () => {

        it('success', () => {
            blogService.delete.and.returnValue(of(null));
            const blogId = '123';
            const action = new UIActions.DeleteBlogRequest(blogId);
            const completion = new UIActions.DeleteBlogSuccess(blogId);
            const expected = cold('--b', { b: completion });
            actions = hot('--a-', { a: action });
            expect(effects.deleteBlogRequest).toBeObservable(expected);
        });
        it('error', () => {
            const error = 'bob';
            blogService.delete.and.returnValue(throwError(error));
            const action = new UIActions.DeleteBlogRequest(null);
            const completion = new UIActions.DeleteBlogError(error);
            const expected = cold('--b', { b: completion });
            actions = hot('--a-', { a: action });
            expect(effects.deleteBlogRequest).toBeObservable(expected);
        });
    });

    it('navigateBlogs', () => {
        const blogId = '123';
        const action = new UIActions.DeleteBlogSuccess(blogId);
        const completion = new UIActions.DeleteBlogSuccess(blogId);
        const expected = cold('--b', { b: completion });
        actions = hot('--a-', { a: action });
        expect(effects.navigateBlogs).toBeObservable(expected);
        expect(router.navigate).toHaveBeenCalledWith(['/blogs']);
    });
});
