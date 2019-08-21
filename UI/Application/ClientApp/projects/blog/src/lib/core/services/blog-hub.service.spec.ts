import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { HubConnectionBuilder } from '@aspnet/signalr';
import { Store } from '@ngrx/store';
import { HttpHubClient, HUB_CONNECTION_BUILDER } from '@renet-consulting/http-hub-client';
import { HubCreateBlogRequest, HubUpdateBlogRequest } from '../actions';
import { BlogHubService } from './blog-hub.service';
import { RootBlogStore } from '../reducers';

class MockHubBuilder implements Partial<HubConnectionBuilder> {

    catch = jasmine.createSpy().and.callFake(fn => fn());
    withUrl = jasmine.createSpy().and.returnValue(this);
    build = jasmine.createSpy().and.returnValue(this);
    on = jasmine.createSpy();
    off = jasmine.createSpy();
    start = jasmine.createSpy().and.returnValue({ catch: this.catch });
    stop = jasmine.createSpy().and.returnValue({ catch: this.catch });
}

describe('BlogHubService', () => {

    let service: BlogHubService;

    let store: jasmine.SpyObj<Store<RootBlogStore>>;
    let connection: MockHubBuilder;

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
        connection = service.connection as Partial<HubConnectionBuilder> as MockHubBuilder;
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
    it('connect', () => {
        spyOn(service, 'log');
        service.connect();
        expect(connection.start).toHaveBeenCalled();
        expect(connection.on).toHaveBeenCalledWith(service.createEvent, service.onCreate);
        expect(connection.on).toHaveBeenCalledWith(service.updateEvent, service.onUpdate);
        expect(connection.catch).toHaveBeenCalled();
        expect(service.log).toHaveBeenCalledWith('Error: connection.start');
    });
    it('disconnect', () => {
        spyOn(service, 'log');
        service.disconnect();
        expect(connection.stop).toHaveBeenCalled();
        expect(connection.off).toHaveBeenCalledWith(service.createEvent, service.onCreate);
        expect(connection.off).toHaveBeenCalledWith(service.updateEvent, service.onUpdate);
        expect(connection.catch).toHaveBeenCalled();
        expect(service.log).toHaveBeenCalledWith('Error: connection.stop');
    });
});
