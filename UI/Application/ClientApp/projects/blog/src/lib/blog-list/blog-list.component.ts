import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { InfiniteSource } from '@renet-consulting/infinite-source';
import { Subscription } from 'rxjs';
import { filter, map, shareReplay, withLatestFrom } from 'rxjs/operators';
import { DeleteBlogs, GetBlogsRequest } from '../actions';
import { BlogHubService } from '../blog-hub.service';
import { BlogModel } from '../blog.model';
import { RootBlogStore } from '../reducers';
import { selectBlogs, selecBlogTotalAmount, selectCreatedBlog, selectUpdatedBlog } from '../selectors';

@Component({
    selector: 'lib-blog-list',
    templateUrl: './blog-list.component.html',
    styleUrls: ['./blog-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlogListComponent implements OnInit, OnDestroy {

    readonly subscription = new Subscription();
    readonly updated = this.store.select(selectUpdatedBlog).pipe(shareReplay(1));
    readonly created = this.store.select(selectCreatedBlog).pipe(shareReplay(1));
    readonly source = new InfiniteSource<BlogModel>();

    constructor(
        @Inject(Store) private store: Store<RootBlogStore>,
        @Inject(BlogHubService) private blogHub: BlogHubService,
    ) { }

    ngOnInit(): void {
        /** to prevent a bug with wrong counting of blogs, on other pages a blog can be added to store */
        this.store.dispatch(new DeleteBlogs());
        this.getItems(0);
        this.blogHub.connect();
        this.subscription.add(this.store.select(selectBlogs).subscribe(this.source.update));
        this.subscription.add(this.source.emitter.pipe(
            withLatestFrom(this.store.select(selecBlogTotalAmount)),
            filter(([end, total]) => end < total),
            map(([end]) => end),
        ).subscribe(this.getItems));
    }

    ngOnDestroy(): void {
        this.blogHub.disconnect();
        this.subscription.unsubscribe();
    }

    trackByFn = (_, x: BlogModel) => x.blogId;

    getItems = (index: number): void => this.store.dispatch(new GetBlogsRequest({ index }));
}
