import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { GetBlogsRequest } from '../actions';
import { BlogModel } from '../blog.model';
import { RootBlogStore } from '../reducers';
import { selectBlogs, selectBlogsAmount, selectBlogsTotal } from '../selectors';

@Component({
    selector: 'lib-blog-list',
    templateUrl: './blog-list.component.html',
    styleUrls: ['./blog-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlogListComponent implements OnInit {

    items = this.store.select(selectBlogs);
    itemsTotal = this.store.select(selectBlogsTotal);
    itemsAmount = this.store.select(selectBlogsAmount);

    constructor(
        @Inject(Store) private store: Store<RootBlogStore>
    ) { }

    ngOnInit(): void {
        this.getItems(0);
    }

    trackByFn = (_, i: BlogModel) => i.blogId;

    getItems = (index: number): void => this.store.dispatch(new GetBlogsRequest({ index }));
}