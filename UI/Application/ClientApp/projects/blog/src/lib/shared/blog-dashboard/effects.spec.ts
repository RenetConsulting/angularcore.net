import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot } from 'jasmine-marbles';
import { Observable, of, throwError } from 'rxjs';
import * as UIActions from '../../core/actions';
import { BlogModel } from '../../core/blog.model';
import { BlogService } from '../../core/services/blog.service';
import { BlogDashboardEffects } from './effects';

describe('BlogDashboardEffects', () => {

    let effects: BlogDashboardEffects;

    let actions: Observable<any>;
    let blogService: jasmine.SpyObj<BlogService>;
    let router: jasmine.SpyObj<Router>;

    beforeEach(() => {

        TestBed.configureTestingModule({
            providers: [
                BlogDashboardEffects,
                provideMockActions(() => actions),
                {
                    provide: BlogService, useValue: jasmine.createSpyObj<BlogService>('BlogService', [
                        'create',
                    ])
                },
                { provide: MatSnackBar, useValue: jasmine.createSpyObj<MatSnackBar>('MatSnackBar', ['openFromComponent']) },
                { provide: Router, useValue: jasmine.createSpyObj<Router>('Router', ['navigate']) },
            ],
        });

        effects = TestBed.get(BlogDashboardEffects);
        blogService = TestBed.get(BlogService);
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
});
