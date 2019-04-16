import { Inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, mergeMap, tap } from "rxjs/operators";
import * as UIActions from "./actions";
import { BlogService } from "./blog.service";
import { BlogTypes } from "./types";

@Injectable()
export class BlogEffects {

    constructor(
        @Inject(Actions) private actions: Actions,
        @Inject(BlogService) private blogService: BlogService,
        @Inject(Router) private router: Router,
    ) { }

    @Effect() createBlogRequest = this.actions.pipe(
        ofType<UIActions.CreateBlogRequest>(BlogTypes.CREATE_BLOG_REQUEST),
        mergeMap(a => this.blogService.create(a.payload).pipe(
            map(r => new UIActions.CreateBlogSuccess(r)),
            tap(() => this.router.navigate(['/blogs'])),
            catchError(e => of(new UIActions.CreateBlogError(e.error)))
        ))
    );

    @Effect() getBlogsRequest = this.actions.pipe(
        ofType<UIActions.GetBlogsRequest>(BlogTypes.GET_BLOGS_REQUEST),
        mergeMap(a => this.blogService.getBlogs({ ...a.payload, count: 10 }).pipe(
            map(r => new UIActions.GetBlogsSuccess(r, a.payload)),
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
            tap(() => this.router.navigate(['/blogs'])),
            catchError(e => of(new UIActions.UpdateBlogError(e.error)))
        ))
    );

    @Effect() deleteBlogRequest = this.actions.pipe(
        ofType<UIActions.DeleteBlogRequest>(BlogTypes.DELETE_BLOG_REQUEST),
        mergeMap(a => this.blogService.delete(a.payload).pipe(
            map(() => new UIActions.DeleteBlogSuccess(a.payload)),
            tap(() => this.router.navigate(['/blogs'])),
            catchError(e => of(new UIActions.DeleteBlogError(e.error)))
        ))
    );
}