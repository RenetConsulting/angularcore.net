import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import * as UIActions from '../actions';
import { BlogService } from '../blog.service';
import { BlogTypes } from '../types';

/** TODO: add prompt on delete */
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
            tap(() => this.router.navigate(['/blogs'])),
            catchError(e => of(new UIActions.UpdateBlogError(e)))
        ))
    );

    @Effect() deleteBlogRequest = this.actions.pipe(
        ofType<UIActions.DeleteBlogRequest>(BlogTypes.DELETE_BLOG_REQUEST),
        mergeMap(a => this.blogService.delete(a.payload).pipe(
            map(() => new UIActions.DeleteBlogSuccess(a.payload)),
            tap(() => this.router.navigate(['/blogs'])),
            catchError(e => of(new UIActions.DeleteBlogError(e)))
        ))
    );
}
