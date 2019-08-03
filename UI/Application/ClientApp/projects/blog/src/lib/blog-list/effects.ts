import { Inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of, SchedulerLike } from 'rxjs';
import { catchError, delay, filter, map, mergeMap, tap } from 'rxjs/operators';
import * as UIActions from '../actions';
import { BlogDefaultOptions } from '../blog-default-options';
import { BlogService } from '../blog.service';
import { SCHEDULER } from '../scheduler';
import { BlogTypes } from '../types';
import { MessageDialogComponent } from './message-dialog/message-dialog.component';

@Injectable()
export class BlogListEffects {

    constructor(
        @Inject(Actions) private actions: Actions,
        @Inject(BlogService) private blogService: BlogService,
        @Inject(MatSnackBar) private snackBar: MatSnackBar,
        @Inject(BlogDefaultOptions) private options: BlogDefaultOptions,
        @Inject(SCHEDULER) private scheduler: SchedulerLike
    ) { }

    @Effect() getBlogsRequest = this.actions.pipe(
        ofType<UIActions.GetBlogsRequest>(BlogTypes.GET_BLOGS_REQUEST),
        mergeMap(a => this.blogService.getBlogs({ ...a.payload, count: this.options.count }).pipe(
            map(r => new UIActions.GetBlogsSuccess(r)),
            catchError(e => of(new UIActions.GetBlogsError(e)))
        ))
    );

    @Effect() hubCreateBlogRequest = this.actions.pipe(
        ofType<UIActions.HubCreateBlogRequest>(BlogTypes.HUB_CREATE_BLOG_REQUEST),
        map(action => ({ action, instance: this.snackBar.openFromComponent(MessageDialogComponent).instance })),
        tap(x => x.instance.setContent('created blog')),
        mergeMap(x => x.instance.change.pipe(
            filter(z => z),
            map(() => new UIActions.HubCreateBlogSuccess(x.action.payload))
        ))
    );

    @Effect() hubUpdateBlogRequest = this.actions.pipe(
        ofType<UIActions.HubUpdateBlogRequest>(BlogTypes.HUB_UPDATE_BLOG_REQUEST),
        map(action => ({ action, instance: this.snackBar.openFromComponent(MessageDialogComponent).instance })),
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
