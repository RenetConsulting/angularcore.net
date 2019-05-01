import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { HubConnectionBuilder } from '@aspnet/signalr';
import { Store } from '@ngrx/store';
import { HttpHubClient } from '@renet-consulting/http-hub-client';
import { RootStore } from '~/reducers';
import { HubCreate, HubUpdate } from './actions';
import { BlogModel } from './blog.model';

@Injectable({
    providedIn: 'root'
})
export class BlogHubService {

    /** internal */
    readonly connection = new HubConnectionBuilder()
        .withUrl('/BlogHub', { httpClient: this.httpClient })
        .build();

    constructor(
        @Inject(HttpHubClient) private httpClient: HttpHubClient,
        @Inject(HttpClient) public http: HttpClient,
        @Inject(Store) private store: Store<RootStore>,
    ) { }

    /** internal */
    update = (x: BlogModel): void => this.store.dispatch(new HubUpdate(x));

    /** internal */
    create = (x: BlogModel): void => this.store.dispatch(new HubCreate(x));

    /** internal */
    onUpdate = (): void => {
        this.connection.on('update', this.update);
    }

    /** internal */
    onCreate = (): void => {
        this.connection.on('create', this.create);
    }

    connect = (): void => {
        this.connection.start();
        this.onUpdate();
        this.onCreate();

        /** TODO: delete, this line just runs hub */
        // this.http.get('https://localhost:44395/api/BlogHub').subscribe();
    }

    disconnect = (): void => {
        this.connection.stop();
    }
}