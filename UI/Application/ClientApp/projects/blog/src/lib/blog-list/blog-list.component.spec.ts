import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { GetBlogsRequest } from '../actions';
import { BlogHubService } from '../blog-hub.service';
import { BlogModel } from '../blog.model';
import { RootBlogStore } from '../reducers';
import { BlogListComponent } from './blog-list.component';

describe('BlogListComponent', () => {

    let component: BlogListComponent;

    let store: MockStore<RootBlogStore>;
    let blogHub: jasmine.SpyObj<BlogHubService>;

    beforeEach(() => {

        TestBed.configureTestingModule({
            providers: [
                provideMockStore({}),
                { provide: BlogHubService, useValue: jasmine.createSpyObj<BlogHubService>('BlogHubService', ['connect', 'disconnect']) }
            ]
        });

        store = TestBed.get(Store);
        blogHub = TestBed.get(BlogHubService);

        component = new BlogListComponent(store, blogHub);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('ngOnInit', () => {
        spyOn(component, 'getItems');
        spyOn(component.source, 'update');
        const end = 9;
        store.setState({ blog: { ids: [], entities: {}, totalAmount: 10 } });

        component.ngOnInit();

        component.source.emitter.next(end);

        expect(component.getItems).toHaveBeenCalledWith(0);
        expect(component.getItems).toHaveBeenCalledWith(end);
        expect(component.getItems).toHaveBeenCalledTimes(2);
        expect(component.source.update).toHaveBeenCalled();

        component.ngOnDestroy();
    });
    it('ngOnDestroy', () => {
        component.ngOnDestroy();
        expect(blogHub.disconnect).toHaveBeenCalled();
        expect(component.subscription.closed).toEqual(true);
    });
    it('trackByFn', () => {
        const blogId = 'bob';
        expect(component.trackByFn(0, { blogId } as BlogModel)).toEqual(blogId);
    });
    it('getItems', () => {
        spyOn(store, 'dispatch');
        const index = 0;
        component.getItems(index);
        expect(store.dispatch).toHaveBeenCalledWith(new GetBlogsRequest({ index }));
    });
});
