import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter, take } from 'rxjs/operators';
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
export class BlogListComponent implements OnInit, OnDestroy {

    readonly subscription = new Subscription();
    items = this.store.select(selectBlogs);
    itemsTotal = this.store.select(selectBlogsTotal);
    itemsAmount = this.store.select(selectBlogsAmount);

    constructor(
        @Inject(Store) private store: Store<RootBlogStore>
    ) { }

    /** a case with a new blog will work fine, SingleR coming soon */
    ngOnInit(): void {
        this.subscription.add(this.store.select(selectBlogs).pipe(
            filter(x => !x || x.length <= 1),
            take(1)).subscribe(() => this.getItems(0)));
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    trackByFn = (_, i: BlogModel) => i.blogId;

    getItems = (index: number): void => this.store.dispatch(new GetBlogsRequest({ index }));
}