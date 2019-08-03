import { Inject, Injectable } from '@angular/core';
import { HubConnectionBuilder } from '@aspnet/signalr';
import { Store } from '@ngrx/store';
import { HttpHubClient, HUB_CONNECTION_BUILDER } from '@renet-consulting/http-hub-client';
import { RootStore } from '~/reducers';
import { HubCreateBlogRequest, HubUpdateBlogRequest } from './actions';
import { BlogDefaultOptions } from './blog-default-options';
import { BlogModel } from './blog.model';

@Injectable({
    providedIn: 'root'
})
export class BlogHubService {

    readonly connection = new this.hubBuilder()
        .withUrl(this.options.entryBlogHubUrl, { httpClient: this.httpHub })
        .build();

    constructor(
        @Inject(HttpHubClient) private httpHub: HttpHubClient,
        @Inject(HUB_CONNECTION_BUILDER) private hubBuilder: typeof HubConnectionBuilder,
        @Inject(Store) private store: Store<RootStore>,
        @Inject(BlogDefaultOptions) private options: BlogDefaultOptions,
    ) { }

    onCreate = (x: BlogModel) => this.store.dispatch(new HubCreateBlogRequest(x));

    onUpdate = (x: BlogModel) => this.store.dispatch(new HubUpdateBlogRequest(x));

    listenCreate = () => this.connection.on('create', this.onCreate);

    listenUpdate = () => this.connection.on('update', this.onUpdate);

    connect = (): void => {
        this.connection.start();
        this.listenCreate();
        this.listenUpdate();
    }

    disconnect = (): void => {
        this.connection.stop();
    }
}
