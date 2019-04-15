import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { GetBlogRequest } from '../actions';
import { RootBlogStore } from '../reducers';
import { selectSelectedBlog } from '../selectors';

@Component({
    selector: 'lib-blog-detail',
    templateUrl: './blog-detail.component.html',
    styleUrls: ['./blog-detail.component.sass'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlogDetailComponent implements OnInit {

    item = this.store.select(selectSelectedBlog);

    constructor(
        @Inject(Store) private store: Store<RootBlogStore>,
        @Inject(ActivatedRoute) private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        const blogId = this.route.snapshot.paramMap.get('blogId');
        this.store.dispatch(new GetBlogRequest(blogId));
    }
}
