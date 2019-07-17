import { EventEmitter } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot } from 'jasmine-marbles';
import { Observable, of, throwError } from 'rxjs';
import * as UIActions from './actions';
import { BlogModel } from './blog.model';
import { BlogService } from './blog.service';
import { BlogEffects } from './effects';
import { MessageComponent } from './message/message.component';

describe('BlogEffects', () => {

    let effects: BlogEffects;

    let actions: Observable<any>;
    let blogService: jasmine.SpyObj<BlogService>;
    let snackBar: jasmine.SpyObj<MatSnackBar>;
    let router: jasmine.SpyObj<Router>;

    beforeEach(() => {

        TestBed.configureTestingModule({
            providers: [
                BlogEffects,
                provideMockActions(() => actions),
                {
                    provide: BlogService, useValue: jasmine.createSpyObj<BlogService>('BlogService', [
                        'create',
                        'getBlogs',
                        'getBlog',
                        'update',
                        'delete'
                    ])
                },
                { provide: MatSnackBar, useValue: jasmine.createSpyObj<MatSnackBar>('MatSnackBar', ['openFromComponent']) },
                { provide: Router, useValue: jasmine.createSpyObj<Router>('Router', ['navigate']) },
            ],
        });

        effects = TestBed.get(BlogEffects);
        blogService = TestBed.get(BlogService);
        snackBar = TestBed.get(MatSnackBar);
        router = TestBed.get(Router);
    });

    it('should work', () => {
        expect(effects).toBeDefined();
    });

    describe('createBlogRequest', () => {

        const item = {} as BlogModel;

        it('success', () => {
            blogService.create.and.returnValue(of(item));
            const action = new UIActions.CreateBlogRequest(item);
            const completion = new UIActions.CreateBlogSuccess(item);
            const expected = cold('--b', { b: completion });
            actions = hot('--a-', { a: action });
            expect(effects.createBlogRequest).toBeObservable(expected);
            expect(router.navigate).toHaveBeenCalledWith(['/blogs']);
        });
        it('error', () => {
            const error = 'bob';
            blogService.create.and.returnValue(throwError(error));
            const action = new UIActions.CreateBlogRequest(item);
            const completion = new UIActions.CreateBlogError(error);
            const expected = cold('--b', { b: completion });
            actions = hot('--a-', { a: action });
            expect(effects.createBlogRequest).toBeObservable(expected);
        });
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
            expect(router.navigate).toHaveBeenCalledWith(['/blogs']);
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

    describe('deleteBlogRequest', () => {

        it('success', () => {
            blogService.delete.and.returnValue(of(null));
            const action = new UIActions.DeleteBlogRequest(null);
            const completion = new UIActions.DeleteBlogSuccess(null);
            const expected = cold('--b', { b: completion });
            actions = hot('--a-', { a: action });
            expect(effects.deleteBlogRequest).toBeObservable(expected);
            expect(router.navigate).toHaveBeenCalledWith(['/blogs']);
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

    describe('have to open MessageComponent', () => {

        let instance: MessageComponent;

        beforeEach(() => {

            instance = {
                setContent: jasmine.createSpy() as (x: string) => void,
                change: of(true) as EventEmitter<boolean>
            } as MessageComponent;

            snackBar.openFromComponent.and.returnValue({ instance } as MatSnackBarRef<MessageComponent>);
        });

        it('hubCreateBlogRequest', () => {
            const action = new UIActions.HubCreateBlogRequest(null);
            const completion = new UIActions.HubCreateBlogSuccess(null);
            const expected = cold('--b', { b: completion });
            actions = hot('--a-', { a: action });
            expect(effects.hubCreateBlogRequest).toBeObservable(expected);
            expect(snackBar.openFromComponent).toHaveBeenCalledWith(MessageComponent);
            expect(instance.setContent).toHaveBeenCalledWith('created blog');
        });
        it('hubUpdateBlogRequest', () => {
            const action = new UIActions.HubUpdateBlogRequest(null);
            const completion = new UIActions.HubUpdateBlogSuccess(null);
            const expected = cold('--b', { b: completion });
            actions = hot('--a-', { a: action });
            expect(effects.hubUpdateBlogRequest).toBeObservable(expected);
            expect(snackBar.openFromComponent).toHaveBeenCalledWith(MessageComponent);
            expect(instance.setContent).toHaveBeenCalledWith('updated blog');
        });
    });

    it('HubCreateBlogSuccess', () => {
        const action = new UIActions.HubCreateBlogSuccess(null);
        const completion = new UIActions.CreateBlogSuccess(null);
        const expected = cold('--b', { b: completion });
        actions = hot('--a-', { a: action });
        expect(effects.hubCreateBlogSuccess).toBeObservable(expected);
    });
    it('hubUpdateBlogSuccess', () => {
        const action = new UIActions.HubUpdateBlogSuccess(null);
        const completion = new UIActions.UpdateBlogSuccess(null);
        const expected = cold('--b', { b: completion });
        actions = hot('--a-', { a: action });
        expect(effects.hubUpdateBlogSuccess).toBeObservable(expected);
    });
});
