import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { HubConnectionBuilder } from '@aspnet/signalr';
import { HttpHubClient } from './http-hub-client';

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
        @Inject(HttpClient) public http: HttpClient
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