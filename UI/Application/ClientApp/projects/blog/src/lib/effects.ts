import { Inject, Injectable, Optional } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { asyncScheduler, of } from 'rxjs';
import { catchError, delay, filter, map, mergeMap, tap } from 'rxjs/operators';
import * as UIActions from './actions';
import { BlogDefaultOptions } from './blog-default-options';
import { BlogService } from './blog.service';
import { MessageComponent } from './message/message.component';
import { SCHEDULER } from './scheduler';
import { BlogTypes } from './types';

@Injectable()
export class BlogEffects {

    constructor(
        @Inject(Actions) private actions: Actions,
        @Inject(BlogService) private blogService: BlogService,
        @Inject(Router) private router: Router,
        @Inject(MatSnackBar) private snackBar: MatSnackBar,
        @Inject(BlogDefaultOptions) private options: BlogDefaultOptions,
        @Inject(MessageComponent) private dialogComponent: typeof MessageComponent,
        @Inject(SCHEDULER) @Optional() private scheduler = asyncScheduler
    ) { }

    @Effect() createBlogRequest = this.actions.pipe(
        ofType<UIActions.CreateBlogRequest>(BlogTypes.CREATE_BLOG_REQUEST),
        mergeMap(a => this.blogService.create(a.payload).pipe(
            map(r => new UIActions.CreateBlogSuccess(r)),
            tap(() => this.router.navigate(['/blogs'])),
            catchError(e => of(new UIActions.CreateBlogError(e)))
        ))
    );

    @Effect() getBlogsRequest = this.actions.pipe(
        ofType<UIActions.GetBlogsRequest>(BlogTypes.GET_BLOGS_REQUEST),
        mergeMap(a => this.blogService.getBlogs({ ...a.payload, count: this.options.count }).pipe(
            map(r => new UIActions.GetBlogsSuccess(r)),
            catchError(e => of(new UIActions.GetBlogsError(e)))
        ))
    );

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

    @Effect() hubCreateBlogRequest = this.actions.pipe(
        ofType<UIActions.HubCreateBlogRequest>(BlogTypes.HUB_CREATE_BLOG_REQUEST),
        map(action => ({ action, instance: this.snackBar.openFromComponent(this.dialogComponent).instance })),
        tap(x => x.instance.setContent('created blog')),
        mergeMap(x => x.instance.change.pipe(
            filter(z => z),
            map(() => new UIActions.HubCreateBlogSuccess(x.action.payload))
        ))
    );

    @Effect() hubUpdateBlogRequest = this.actions.pipe(
        ofType<UIActions.HubUpdateBlogRequest>(BlogTypes.HUB_UPDATE_BLOG_REQUEST),
        map(action => ({ action, instance: this.snackBar.openFromComponent(this.dialogComponent).instance })),
        tap(x => x.instance.setContent('updated blog')),
        mergeMap(x => x.instance.change.pipe(
            filter(z => z),
            map(() => new UIActions.HubUpdateBlogSuccess(x.action.payload))
        ))
    );

    @Effect() hubCreateBlogSuccess = this.actions.pipe(
        ofType<UIActions.HubCreateBlogSuccess>(BlogTypes.HUB_CREATE_BLOG_SUCCESS),
        delay(this.options.amountOfTimeViewingModifiedBlog, this.scheduler),
        map(() => new UIActions.DeleteCreatedBlog())
    );

    @Effect() hubUpdateBlogSuccess = this.actions.pipe(
        ofType<UIActions.HubUpdateBlogSuccess>(BlogTypes.HUB_UPDATE_BLOG_SUCCESS),
        delay(this.options.amountOfTimeViewingModifiedBlog, this.scheduler),
        map(() => new UIActions.DeleteUpdatedBlog())
    );
}
