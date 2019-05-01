import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { GetBlogsRequest } from '../actions';
import { BlogHubService } from '../blog-hub.service';
import { BlogModel } from '../blog.model';
import { RootBlogStore } from '../reducers';
import { selectBlogs, selectBlogsAmount, selectBlogsTotal } from '../selectors';

@Component({
    selector: 'lib-blog-list',
    templateUrl: './blog-list.component.html',
    styleUrls: ['./blog-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlogListComponent implements OnInit, OnDestroy {

    readonly subscription = new Subscription();
    items = this.store.select(selectBlogs);
    itemsTotal = this.store.select(selectBlogsTotal);
    itemsAmount = this.store.select(selectBlogsAmount);

    constructor(
        @Inject(Store) private store: Store<RootBlogStore>,
        @Inject(BlogHubService) private blogHub: BlogHubService,
    ) { }

    ngOnInit(): void {
        this.getItems(0);
        this.blogHub.connect();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
        this.blogHub.disconnect();
    }

    trackByFn = (_, i: BlogModel) => i.blogId;

    getItems = (index: number): void => this.store.dispatch(new GetBlogsRequest({ index }));
}