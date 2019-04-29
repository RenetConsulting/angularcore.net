import { Inject, Injectable } from '@angular/core';
import { HubConnectionBuilder } from '@aspnet/signalr';
import { HttpHubClient } from './http-hub-client';

@Injectable({
    providedIn: 'root'
})
export class BlogHubService {

    /** internal */
    readonly connection = new HubConnectionBuilder()
        .withUrl('/blog', { httpClient: this.httpClient })
        .build();

    constructor(
        @Inject(HttpHubClient) public httpClient: HttpHubClient
    ) { }

    /** internal */
    onUpdate = (): void => {
        this.connection.on('update', console.log);
    }

    /** internal */
    onCreate = (): void => {
        this.connection.on('create', console.log);
    }

    connect = (): void => {
        this.onUpdate();
        this.onCreate();
    }

    disconnect = (): void => {
        this.connection.off('update');
        this.connection.off('create');
    }
}