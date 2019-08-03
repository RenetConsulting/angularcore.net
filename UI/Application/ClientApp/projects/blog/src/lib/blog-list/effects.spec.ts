import { EventEmitter } from '@angular/core';
import { fakeAsync, TestBed } from '@angular/core/testing';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, getTestScheduler, hot } from 'jasmine-marbles';
import { Observable, of, throwError } from 'rxjs';
import * as UIActions from '../actions';
import { BlogDefaultOptions } from '../blog-default-options';
import { BlogService } from '../blog.service';
import { SCHEDULER } from '../scheduler';
import { BlogListEffects } from './effects';
import { MessageDialogComponent } from './message-dialog/message-dialog.component';

describe('BlogListEffects', () => {

    let effects: BlogListEffects;

    let actions: Observable<any>;
    let blogService: jasmine.SpyObj<BlogService>;
    let snackBar: jasmine.SpyObj<MatSnackBar>;
    const options: Partial<BlogDefaultOptions> = { amountOfTimeViewingModifiedBlog: 10 };
    let instance: MessageDialogComponent;

    beforeEach(() => {

        instance = { setContent: jasmine.createSpy() as any, change: of(true) as EventEmitter<boolean> } as MessageDialogComponent;

        TestBed.configureTestingModule({
            providers: [
                BlogListEffects,
                provideMockActions(() => actions),
                { provide: BlogService, useValue: jasmine.createSpyObj<BlogService>('BlogService', ['getBlogs']) },
                { provide: MatSnackBar, useValue: jasmine.createSpyObj<MatSnackBar>('MatSnackBar', ['openFromComponent']) },
                { provide: Router, useValue: jasmine.createSpyObj<Router>('Router', ['navigate']) },
                { provide: BlogDefaultOptions, useValue: options },
                { provide: SCHEDULER, useValue: getTestScheduler() },
            ],
        });

        effects = TestBed.get(BlogListEffects);
        blogService = TestBed.get(BlogService);
        snackBar = TestBed.get(MatSnackBar);

        snackBar.openFromComponent.and.returnValue({ instance } as MatSnackBarRef<MessageDialogComponent>);
    });

    it('should work', () => {
        expect(effects).toBeDefined();
    });

    describe('getBlogsRequest', () => {

        it('success', () => {
            blogService.getBlogs.and.returnValue(of(null));
            const action = new UIActions.GetBlogsRequest(null);
            const completion = new UIActions.GetBlogsSuccess(null);
            const expected = cold('--b', { b: completion });
            actions = hot('--a-', { a: action });
            expect(effects.getBlogsRequest).toBeObservable(expected);
        });
        it('error', () => {
            const error = 'bob';
            blogService.getBlogs.and.returnValue(throwError(error));
            const action = new UIActions.GetBlogsRequest(null);
            const completion = new UIActions.GetBlogsError(error);
            const expected = cold('--b', { b: completion });
            actions = hot('--a-', { a: action });
            expect(effects.getBlogsRequest).toBeObservable(expected);
        });
    });

    describe('have to open MessageComponent', () => {

        it('hubCreateBlogRequest', () => {
            const action = new UIActions.HubCreateBlogRequest(null);
            const completion = new UIActions.HubCreateBlogSuccess(null);
            const expected = cold('--b', { b: completion });
            actions = hot('--a-', { a: action });
            expect(effects.hubCreateBlogRequest).toBeObservable(expected);
            expect(snackBar.openFromComponent).toHaveBeenCalledWith(MessageDialogComponent);
            expect(instance.setContent).toHaveBeenCalledWith('created blog');
        });
        it('hubUpdateBlogRequest', () => {
            const action = new UIActions.HubUpdateBlogRequest(null);
            const completion = new UIActions.HubUpdateBlogSuccess(null);
            const expected = cold('--b', { b: completion });
            actions = hot('--a-', { a: action });
            expect(effects.hubUpdateBlogRequest).toBeObservable(expected);
            expect(snackBar.openFromComponent).toHaveBeenCalledWith(MessageDialogComponent);
            expect(instance.setContent).toHaveBeenCalledWith('updated blog');
        });
    });

    it('hubCreateBlogSuccess', fakeAsync(() => {
        const action = new UIActions.HubCreateBlogSuccess(null);
        const completion = new UIActions.DeleteCreatedBlog();
        const expected = cold('10ms --b', { b: completion });
        actions = hot('--a-', { a: action });
        expect(effects.hubCreateBlogSuccess).toBeObservable(expected);
    }));
    it('hubUpdateBlogSuccess', fakeAsync(() => {
        const action = new UIActions.HubUpdateBlogSuccess(null);
        const completion = new UIActions.DeleteUpdatedBlog();
        const expected = cold('10ms --b', { b: completion });
        actions = hot('--a-', { a: action });
        expect(effects.hubUpdateBlogSuccess).toBeObservable(expected);
    }));
});
