import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { tap } from 'rxjs/operators';
import { GetBlogRequest } from '../actions';
import { BlogModel } from '../blog.model';
import { RootBlogStore } from '../reducers';
import { selectSelectedBlog } from '../selectors';

@Component({
    selector: 'lib-blog-detail',
    templateUrl: './blog-detail.component.html',
    styleUrls: ['./blog-detail.component.sass'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlogDetailComponent implements OnInit {

    readonly item = this.store.select(selectSelectedBlog).pipe(tap(i => this.updateBlog(i)));
    readonly formControl = new FormControl();

    constructor(
        @Inject(Store) private store: Store<RootBlogStore>,
        @Inject(ActivatedRoute) private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        const blogId = this.route.snapshot.paramMap.get('blogId');
        this.store.dispatch(new GetBlogRequest(blogId));
    }

    updateBlog = (model?: BlogModel): void => {
        if (model) {
            this.formControl.patchValue(model.content);
        }
    }
}
