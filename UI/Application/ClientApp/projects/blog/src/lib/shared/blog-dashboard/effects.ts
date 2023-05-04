import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import * as UIActions from '../../core/actions';
import { BlogService } from '../../core/services/blog.service';
import { BlogTypes } from '../../core/types';

@Injectable()
export class BlogDashboardEffects {

    constructor(
        @Inject(Actions) private actions: Actions,
        @Inject(BlogService) private blogService: BlogService,
        @Inject(Router) private router: Router,
    ) { }

     createBlogRequest = createEffect(() => this.actions.pipe(
        ofType<UIActions.CreateBlogRequest>(BlogTypes.CREATE_BLOG_REQUEST),
        mergeMap(a => this.blogService.create(a.payload).pipe(
            map(r => new UIActions.CreateBlogSuccess(r)),
            tap(() => this.router.navigate(['/blogs'])),
            catchError(e => of(new UIActions.CreateBlogError(e)))
        ))
    ));
}
