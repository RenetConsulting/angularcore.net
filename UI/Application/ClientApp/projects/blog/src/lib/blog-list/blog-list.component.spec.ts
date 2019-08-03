import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { GetBlogsRequest } from '../actions';
import { BlogHubService } from '../blog-hub.service';
import { BlogModel } from '../blog.model';
import { RootBlogStore } from '../reducers';
import { BlogListComponent } from './blog-list.component';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

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
        spyOn(component, 'scrollToModel');
        const end = 9;
        const created = {} as BlogModel;
        const updated = {} as BlogModel;
        store.setState({ blog: { ids: [], entities: {}, totalAmount: 10, created, updated } });

        component.ngOnInit();

        component.source.emitter.next(end);

        expect(component.getItems).toHaveBeenCalledWith(0);
        expect(component.getItems).toHaveBeenCalledWith(end);
        expect(component.getItems).toHaveBeenCalledTimes(2);
        expect(component.source.update).toHaveBeenCalled();
        expect(component.scrollToModel).toHaveBeenCalledTimes(2);

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
    it('scrollToIndex', () => {
        component.cdk = jasmine.createSpyObj<CdkVirtualScrollViewport>('CdkVirtualScrollViewport', ['scrollToIndex']);
        const index = 24;
        component.scrollToIndex(index);
        expect(component.cdk.scrollToIndex).toHaveBeenCalledWith(index, 'smooth');
    });

    describe('scrollToModel', () => {

        it('should call scrollToIndex', () => {
            const model = { blogId: 'blog' } as BlogModel;
            const blogs = [{} as BlogModel, {} as BlogModel, model];
            const index = 2;
            spyOn(component.source.stream, 'getValue').and.returnValue(blogs);
            spyOn(component, 'scrollToIndex');
            component.scrollToModel(model);
            expect(component.scrollToIndex).toHaveBeenCalledWith(index);
        });
        it('should not call scrollToIndex', () => {
            spyOn(component, 'scrollToIndex');
            component.scrollToModel(null);
            expect(component.scrollToIndex).not.toHaveBeenCalled();
        });
    });
});
