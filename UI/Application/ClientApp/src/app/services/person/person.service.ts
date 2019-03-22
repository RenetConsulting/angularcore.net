import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { IPerson } from '../../interfaces/person';

@Injectable({
    providedIn: 'root'
})
export class PersonService {

    readonly url = '/api/person';

    constructor(
        @Inject(HttpClient) private http: HttpClient
    ) { }

    getProfile = () => this.http.get<IPerson>(`${this.url}/profile`);

    update = (model: IPerson) => this.http.put<null>(`${this.url}`, model);
}
