import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { InfiniteSource } from '@renet-consulting/infinite-source';
import { of, Subscription } from 'rxjs';
import { RootBlogStore } from '../../reducers';
import { DeleteFilePreRequest, GetFilesRequest, SelectFile, UploadFileRequest } from './actions';
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
        component.viewport = {
            scrolledIndexChange: of(0),
            scrollToIndex: jasmine.createSpy() as any,
            checkViewportSize: jasmine.createSpy() as any,
        } as CdkVirtualScrollViewport;
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
        spyOn(component.source, 'update');
        const end = 9;
        store.setState({ file: { ids: [], entities: {}, totalAmount: 10 } });

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
        expect(store.dispatch).toHaveBeenCalledWith(new DeleteFilePreRequest(item.fileId));
    });
    it('onSelect', () => {
        spyOn(store, 'dispatch');
        const item = { fileUrl: 'bob' } as FileModel;
        component.onSelect(item);
        expect(store.dispatch).toHaveBeenCalledWith(new SelectFile(item));
    });
    it('setTotal', () => {
        spyOn(component, 'viewChange');
        const total = 12;
        component.setTotal(total);
        expect(component.viewChange).toHaveBeenCalledWith({ start: component.start, end: component.end });
        expect(component.total).toEqual(total);
    });

    describe('prev', () => {

        it('0', () => {
            component.prev();
            expect(component.viewport.scrollToIndex).not.toHaveBeenCalled();
        });
        it('index', () => {
            component.start = 8;
            component.shift = 4;
            component.prev();
            expect(component.viewport.scrollToIndex).toHaveBeenCalledWith(4, component.behavior);
        });
        it('index', () => {
            component.start = 3;
            component.shift = 4;
            component.prev();
            expect(component.viewport.scrollToIndex).toHaveBeenCalledWith(0, component.behavior);
        });
    });

    describe('next', () => {

        beforeEach(() => {
            component.total = 12;
        });

        it('total', () => {
            component.next();
            expect(component.viewport.scrollToIndex).not.toHaveBeenCalled();
        });
        it('index less then total', () => {
            component.start = 3;
            component.shift = 4;
            component.next();
            expect(component.viewport.scrollToIndex).toHaveBeenCalledWith(7, component.behavior);
        });
        it('index more then total', () => {
            component.start = 9;
            component.shift = 4;
            component.next();
            expect(component.viewport.scrollToIndex).toHaveBeenCalledWith(component.total, component.behavior);
        });
    });

    it('onResize', () => {
        spyOn(component, 'setButtonStatus');
        component.onResize({ width: 700 } as DOMRectReadOnly);
        expect(component.shift).toEqual(3);
        expect(component.viewport.checkViewportSize).toHaveBeenCalled();
        expect(component.setButtonStatus).toHaveBeenCalled();
    });
    it('viewChange', () => {
        spyOn(component, 'setButtonStatus');
        const start = 1;
        const end = 0;
        component.viewChange({ start, end });
        expect(component.start).toEqual(start);
        expect(component.end).toEqual(end);
        expect(component.setButtonStatus).toHaveBeenCalled();
    });
    it('setButtonStatus', () => {
        spyOn(component, 'setPrev');
        spyOn(component, 'setNext');
        component.setButtonStatus();
        expect(component.setPrev).toHaveBeenCalled();
        expect(component.setNext).toHaveBeenCalled();
    });

    describe('setPrev', () => {

        it('true', () => {
            spyOn(component.prevDisabled, 'next');
            component.setPrev();
            expect(component.prevDisabled.next).toHaveBeenCalledWith(true);
        });
        it('start more than 0', () => {
            spyOn(component.prevDisabled, 'next');
            component.start = 1;
            component.setPrev();
            expect(component.prevDisabled.next).toHaveBeenCalledWith(false);
        });
    });

    describe('setNext', () => {

        it('true', () => {
            spyOn(component.nextDisabled, 'next');
            component.setNext();
            expect(component.nextDisabled.next).toHaveBeenCalledWith(true);
        });
        it('total less than shift', () => {
            spyOn(component.nextDisabled, 'next');
            component.end = 1;
            component.shift = 4;
            component.total = 3;
            component.setNext();
            expect(component.nextDisabled.next).toHaveBeenCalledWith(true);
        });
        it('total more than shift', () => {
            spyOn(component.nextDisabled, 'next');
            component.end = 1;
            component.shift = 4;
            component.total = 5;
            component.setNext();
            expect(component.nextDisabled.next).toHaveBeenCalledWith(false);
        });
    });
});
