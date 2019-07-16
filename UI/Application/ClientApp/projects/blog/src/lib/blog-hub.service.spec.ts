import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { HubConnectionBuilder } from '@aspnet/signalr';
import { Store } from '@ngrx/store';
import { HttpHubClient, HUB_CONNECTION_BUILDER } from '@renet-consulting/http-hub-client';
import { HubCreateBlogRequest, HubUpdateBlogRequest } from './actions';
import { BlogHubService } from './blog-hub.service';
import { RootBlogStore } from './reducers';

class MockHubBuilder implements Partial<HubConnectionBuilder> {

    withUrl = jasmine.createSpy().and.returnValue(this);
    build = jasmine.createSpy().and.returnValue(this);
    on = jasmine.createSpy();
    start = jasmine.createSpy();
    stop = jasmine.createSpy();
}

describe('BlogHubService', () => {

    let service: BlogHubService;

    let store: jasmine.SpyObj<Store<RootBlogStore>>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                { provide: Store, useValue: jasmine.createSpyObj<Store<RootBlogStore>>('Store', ['dispatch']) },
                { provide: HttpHubClient, useValue: {} as HttpHubClient },
                { provide: HUB_CONNECTION_BUILDER, useValue: MockHubBuilder },
            ]
        });

        service = TestBed.get(BlogHubService);
        store = TestBed.get(Store);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('onCreate', () => {
        service.onCreate(null);
        expect(store.dispatch).toHaveBeenCalledWith(new HubCreateBlogRequest(null));
    });
    it('onUpdate', () => {
        service.onUpdate(null);
        expect(store.dispatch).toHaveBeenCalledWith(new HubUpdateBlogRequest(null));
    });
    it('listenCreate', () => {
        service.listenCreate();
        expect(service.connection.on).toHaveBeenCalledWith('create', service.onCreate);
    });
    it('listenUpdate', () => {
        service.listenUpdate();
        expect(service.connection.on).toHaveBeenCalledWith('update', service.onUpdate);
    });
    it('connect', () => {
        spyOn(service, 'listenCreate');
        spyOn(service, 'listenUpdate');
        service.connect();
        expect(service.connection.start).toHaveBeenCalled();
        expect(service.listenCreate).toHaveBeenCalled();
        expect(service.listenUpdate).toHaveBeenCalled();
    });
    it('disconnect', () => {
        service.disconnect();
        expect(service.connection.stop).toHaveBeenCalled();
    });
});
