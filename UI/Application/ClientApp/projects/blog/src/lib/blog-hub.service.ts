import { Inject, Injectable } from '@angular/core';
import { HubConnectionBuilder } from '@aspnet/signalr';
import { Store } from '@ngrx/store';
import { HttpHubClient } from '@renet-consulting/http-hub-client';
import { RootStore } from '~/reducers';
import { HubCreateBlogRequest, HubUpdateBlogRequest } from './actions';
import { BlogModel } from './blog.model';

@Injectable({
    providedIn: 'root'
})
export class BlogHubService {

    readonly connection = new HubConnectionBuilder()
        .withUrl('/BlogHub', { httpClient: this.httpClient })
        .build();

    constructor(
        @Inject(HttpHubClient) private httpClient: HttpHubClient,
        @Inject(Store) private store: Store<RootStore>,
    ) { }

    onUpdate = (x: BlogModel) => this.store.dispatch(new HubUpdateBlogRequest(x));

    onCreate = (x: BlogModel) => this.store.dispatch(new HubCreateBlogRequest(x));

    listenUpdate = (): void => {
        this.connection.on('update', this.onUpdate);
    }

    listenCreate = (): void => {
        this.connection.on('create', this.onCreate);
    }

    connect = (): void => {
        this.connection.start();
        this.listenUpdate();
        this.listenCreate();
    }

    disconnect = (): void => {
        this.connection.stop();
    }
}