import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { InfiniteSource } from '@renet-consulting/infinite-source';
import { of, Subscription } from 'rxjs';
import { RootBlogStore } from '../../reducers';
import { DeleteFileRequest, GetFilesRequest, SelectFile, UploadFileRequest } from './actions';
import { FileListComponent } from './file-list.component';
import { FileModel } from './file.model';

describe('FileListComponent', () => {

    let component: FileListComponent;

    let store: MockStore<RootBlogStore>;

    beforeEach(() => {

        TestBed.configureTestingModule({
            providers: [
                provideMockStore({}),
            ]
        });

        store = TestBed.get(Store);

        component = new FileListComponent(store);
        component.viewport = { scrolledIndexChange: of(0) } as CdkVirtualScrollViewport;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('subscription', () => {
        expect(component.subscription instanceof Subscription).toEqual(true);
    });
    it('source', () => {
        expect(component.source instanceof InfiniteSource).toEqual(true);
    });
    it('ngOnInit', () => {
        spyOn(component, 'getItems');
        spyOn(component, 'onIndexChange');
        spyOn(component.source, 'update');
        const end = 9;
        store.setState({ file: { ids: [], entities: {}, totalAmount: 10 } });

        component.ngOnInit();

        component.source.emitter.next(end);

        expect(component.getItems).toHaveBeenCalledWith(0);
        expect(component.getItems).toHaveBeenCalledWith(end);
        expect(component.getItems).toHaveBeenCalledTimes(2);
        expect(component.source.update).toHaveBeenCalled();
        expect(component.onIndexChange).toHaveBeenCalled();

        component.ngOnDestroy();
    });
    it('ngOnDestroy', () => {
        component.ngOnDestroy();
        expect(component.subscription.closed).toEqual(true);
    });
    it('trackByFn', () => {
        const fileId = 'bob';
        expect(component.trackByFn(0, { fileId } as FileModel)).toEqual(fileId);
    });
    it('getItems', () => {
        spyOn(store, 'dispatch');
        const index = 0;
        component.getItems(index);
        expect(store.dispatch).toHaveBeenCalledWith(new GetFilesRequest({ index }));
    });
    it('onUpload', () => {
        spyOn(store, 'dispatch');
        const items = [] as Partial<FileList> as FileList;
        component.onUpload(items);
        expect(store.dispatch).toHaveBeenCalledWith(new UploadFileRequest(items));
    });
    it('onDelete', () => {
        spyOn(store, 'dispatch');
        const item = { fileId: 'bob' } as FileModel;
        component.onDelete(item);
        expect(store.dispatch).toHaveBeenCalledWith(new DeleteFileRequest(item.fileId));
    });
    it('onSelect', () => {
        spyOn(store, 'dispatch');
        const item = { fileUrl: 'bob' } as FileModel;
        component.onSelect(item);
        expect(store.dispatch).toHaveBeenCalledWith(new SelectFile(item));
    });
});
