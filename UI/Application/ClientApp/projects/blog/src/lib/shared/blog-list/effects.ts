import { Inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, SchedulerLike } from 'rxjs';
import { catchError, delay, filter, map, mergeMap, tap } from 'rxjs/operators';
import * as UIActions from '../../core/actions';
import { BlogConfig } from '../blog-config';
import { BlogService } from '../../core/services/blog.service';
import { SCHEDULER } from '../../core/scheduler';
import { BlogTypes } from '../../core/types';
import { MessageDialogComponent } from './message-dialog/message-dialog.component';

@Injectable()
export class BlogListEffects {

    constructor(
        @Inject(Actions) private actions: Actions,
        @Inject(BlogService) private blogService: BlogService,
        @Inject(MatSnackBar) private snackBar: MatSnackBar,
        @Inject(BlogConfig) private options: BlogConfig,
        @Inject(SCHEDULER) private scheduler: SchedulerLike
    ) { }

     getBlogsRequest = createEffect(() => this.actions.pipe(
        ofType<UIActions.GetBlogsRequest>(BlogTypes.GET_BLOGS_REQUEST),
        mergeMap(a => this.blogService.getBlogs({ ...a.payload, count: this.options.count }).pipe(
            map(r => new UIActions.GetBlogsSuccess(r)),
            catchError(e => of(new UIActions.GetBlogsError(e)))
        ))
    ));

     hubCreateBlogRequest = createEffect(() => this.actions.pipe(
        ofType<UIActions.HubCreateBlogRequest>(BlogTypes.HUB_CREATE_BLOG_REQUEST),
        map(action => ({ action, instance: this.snackBar.openFromComponent(MessageDialogComponent).instance })),
        tap(x => x.instance.setContent('created blog')),
        mergeMap(x => x.instance.change.pipe(
            filter(z => z),
            map(() => new UIActions.HubCreateBlogSuccess(x.action.payload))
        ))
    ));

     hubUpdateBlogRequest = createEffect(() => this.actions.pipe(
        ofType<UIActions.HubUpdateBlogRequest>(BlogTypes.HUB_UPDATE_BLOG_REQUEST),
        map(action => ({ action, instance: this.snackBar.openFromComponent(MessageDialogComponent).instance })),
        tap(x => x.instance.setContent('updated blog')),
        mergeMap(x => x.instance.change.pipe(
            filter(z => z),
            map(() => new UIActions.HubUpdateBlogSuccess(x.action.payload))
        ))
    ));

     hubCreateBlogSuccess = createEffect(() => this.actions.pipe(
        ofType<UIActions.HubCreateBlogSuccess>(BlogTypes.HUB_CREATE_BLOG_SUCCESS),
        delay(this.options.amountOfTimeViewingModifiedBlog, this.scheduler),
        map(() => new UIActions.DeleteCreatedBlog())
    ));

     hubUpdateBlogSuccess = createEffect(() => this.actions.pipe(
        ofType<UIActions.HubUpdateBlogSuccess>(BlogTypes.HUB_UPDATE_BLOG_SUCCESS),
        delay(this.options.amountOfTimeViewingModifiedBlog, this.scheduler),
        map(() => new UIActions.DeleteUpdatedBlog())
    ));
}
