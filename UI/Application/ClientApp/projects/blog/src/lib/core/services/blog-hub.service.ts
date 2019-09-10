import { Inject, Injectable } from '@angular/core';
import { HubConnectionBuilder } from '@aspnet/signalr';
import { Store } from '@ngrx/store';
import { HttpHubClient, HUB_CONNECTION_BUILDER } from '@renet-consulting/http-hub-client';
import { RootStore } from '~/reducers';
import { HubCreateBlogRequest, HubUpdateBlogRequest } from '../actions';
import { BlogConfig } from '../../shared/blog-config';
import { BlogModel } from '../blog.model';

@Injectable({
    providedIn: 'root'
})
export class BlogHubService {

    readonly connection = new this.hubBuilder()
        .withUrl(this.options.entryBlogHubUrl, { httpClient: this.http })
        .build();
    readonly createEvent = 'create';
    readonly updateEvent = 'update';

    constructor(
        @Inject(HttpHubClient) private http: HttpHubClient,
        @Inject(HUB_CONNECTION_BUILDER) private hubBuilder: typeof HubConnectionBuilder,
        @Inject(Store) private store: Store<RootStore>,
        @Inject(BlogConfig) private options: BlogConfig,
    ) { }

    onCreate = (x: BlogModel) => this.store.dispatch(new HubCreateBlogRequest(x));

    onUpdate = (x: BlogModel) => this.store.dispatch(new HubUpdateBlogRequest(x));

    connect = (): void => {
        this.connection.start().catch(x => this.log(x && x.message || 'Error: connection.start'));
        this.connection.on(this.createEvent, this.onCreate);
        this.connection.on(this.updateEvent, this.onUpdate);
    }

    disconnect = (): void => {
        this.connection.stop().catch(x => this.log(x && x.message || 'Error: connection.stop'));
        this.connection.off(this.createEvent, this.onCreate);
        this.connection.off(this.updateEvent, this.onUpdate);
    }

    log = (...args: Array<any>) => console.warn(...args);
}
