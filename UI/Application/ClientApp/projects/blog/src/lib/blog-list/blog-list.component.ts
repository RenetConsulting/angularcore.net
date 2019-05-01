import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { DeleteBlogs, GetBlogsRequest } from '../actions';
import { BlogHubService } from '../blog-hub.service';
import { BlogModel } from '../blog.model';
import { RootBlogStore } from '../reducers';
import { selectBlogs, selectBlogsAmount, selectBlogsTotal, selectCreatedBlog, selectUpdatedBlog } from '../selectors';

@Component({
    selector: 'lib-blog-list',
    templateUrl: './blog-list.component.html',
    styleUrls: ['./blog-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlogListComponent implements OnInit, OnDestroy {

    readonly items = this.store.select(selectBlogs);
    readonly itemsTotal = this.store.select(selectBlogsTotal);
    readonly itemsAmount = this.store.select(selectBlogsAmount);
    readonly updated = this.store.select(selectUpdatedBlog);
    readonly created = this.store.select(selectCreatedBlog);

    constructor(
        @Inject(Store) private store: Store<RootBlogStore>,
        @Inject(BlogHubService) private blogHub: BlogHubService,
    ) { }

    ngOnInit(): void {
        this.getItems(0);
        this.blogHub.connect();
    }

    ngOnDestroy(): void {
        this.blogHub.disconnect();
        this.store.dispatch(new DeleteBlogs());
    }

    trackByFn = (_, i: BlogModel) => i.blogId;

    getItems = (index: number): void => this.store.dispatch(new GetBlogsRequest({ index }));
}