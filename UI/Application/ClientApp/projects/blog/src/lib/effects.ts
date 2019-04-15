import { Inject, Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, mergeMap } from "rxjs/operators";
import * as UIActions from "./actions";
import { BlogService } from "./blog.service";
import { BlogTypes } from "./types";

@Injectable()
export class BlogEffects {

    constructor(
        @Inject(Actions) private actions: Actions,
        @Inject(BlogService) private blogService: BlogService,
    ) { }

    @Effect() getBlogsRequest = this.actions.pipe(
        ofType<UIActions.GetBlogsRequest>(BlogTypes.GET_BLOGS_REQUEST),
        mergeMap(() => this.blogService.getBlogs().pipe(
            map(r => new UIActions.GetBlogsSuccess(r)),
            catchError(e => of(new UIActions.GetBlogsError(e.error)))
        ))
    );

    @Effect() getBlogRequest = this.actions.pipe(
        ofType<UIActions.GetBlogRequest>(BlogTypes.GET_BLOG_REQUEST),
        mergeMap(a => this.blogService.getBlog(a.payload).pipe(
            map(r => new UIActions.GetBlogSuccess(r, a.payload)),
            catchError(e => of(new UIActions.GetBlogError(e.error)))
        ))
    );

    @Effect() updateBlogRequest = this.actions.pipe(
        ofType<UIActions.UpdateBlogRequest>(BlogTypes.UPDATE_BLOG_REQUEST),
        mergeMap(a => this.blogService.update(a.payload).pipe(
            map(() => new UIActions.UpdateBlogSuccess(a.payload)),
            catchError(e => of(new UIActions.UpdateBlogError(e.error)))
        ))
    );

    @Effect() deleteBlogRequest = this.actions.pipe(
        ofType<UIActions.DeleteBlogRequest>(BlogTypes.DELETE_BLOG_REQUEST),
        mergeMap(a => this.blogService.delete(a.payload).pipe(
            map(() => new UIActions.DeleteBlogSuccess(a.payload)),
            catchError(e => of(new UIActions.DeleteBlogError(e.error)))
        ))
    );
}