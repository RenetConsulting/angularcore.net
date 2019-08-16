import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import * as UIActions from '../../core/actions';
import { BlogService } from '../../core/services/blog.service';
import { BlogTypes } from '../../core/types';

@Injectable()
export class BlogDetailEffects {

    constructor(
        @Inject(Actions) private actions: Actions,
        @Inject(BlogService) private blogService: BlogService,
        @Inject(Router) private router: Router,
    ) { }

    @Effect() getBlogRequest = this.actions.pipe(
        ofType<UIActions.GetBlogRequest>(BlogTypes.GET_BLOG_REQUEST),
        mergeMap(a => this.blogService.getBlog(a.payload).pipe(
            map(r => new UIActions.GetBlogSuccess(r)),
            catchError(e => of(new UIActions.GetBlogError(e)))
        ))
    );

    @Effect() updateBlogRequest = this.actions.pipe(
        ofType<UIActions.UpdateBlogRequest>(BlogTypes.UPDATE_BLOG_REQUEST),
        mergeMap(a => this.blogService.update(a.payload).pipe(
            map(() => new UIActions.UpdateBlogSuccess(a.payload)),
            catchError(e => of(new UIActions.UpdateBlogError(e)))
        ))
    );

    /** TODO: add prompt on delete */
    @Effect() deleteBlogPreRequest = this.actions.pipe(
        ofType<UIActions.DeleteBlogPreRequest>(BlogTypes.DELETE_BLOG_PRE_REQUEST),
        map(a => new UIActions.DeleteBlogRequest(a.payload)),
    );

    @Effect() deleteBlogRequest = this.actions.pipe(
        ofType<UIActions.DeleteBlogRequest>(BlogTypes.DELETE_BLOG_REQUEST),
        mergeMap(a => this.blogService.delete(a.payload).pipe(
            map(() => new UIActions.DeleteBlogSuccess(a.payload)),
            catchError(e => of(new UIActions.DeleteBlogError(e)))
        ))
    );

    @Effect({ dispatch: false }) navigateBlogs = this.actions.pipe(
        ofType<UIActions.UpdateBlogSuccess | UIActions.DeleteBlogRequest>(
            BlogTypes.UPDATE_BLOG_SUCCESS,
            BlogTypes.DELETE_BLOG_SUCCESS
        ),
        tap(() => this.router.navigate(['/blogs'])),
    );
}
