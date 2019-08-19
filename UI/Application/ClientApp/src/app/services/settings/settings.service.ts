import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { HTTP_HEADERS } from '@renet-consulting/auth';
import { ISettings } from '~/interfaces/settings';

@Injectable({
    providedIn: 'root'
})
export class SettingsService {

    readonly url = '/api/settings';

    constructor(
        @Inject(HttpClient) private http: HttpClient,
    ) { }

    get = () => this.http.get<ISettings>(`${this.url}`, { headers: HTTP_HEADERS.allowAnonymous });
}
