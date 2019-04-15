import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { GetBlogsRequest } from '../actions';
import { RootBlogStore } from '../reducers';
import { selectBlogs } from '../selectors';

@Component({
    selector: 'lib-blog-list',
    templateUrl: './blog-list.component.html',
    styleUrls: ['./blog-list.component.sass'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlogListComponent implements OnInit {

    items = this.store.select(selectBlogs);

    constructor(
        @Inject(Store) private store: Store<RootBlogStore>
    ) { }

    ngOnInit(): void {
        this.store.dispatch(new GetBlogsRequest());
    }
}
