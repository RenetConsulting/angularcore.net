import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BlogModel } from './blog.model';
import { IRequestBlogs } from './request-blogs';
import { IResponseList } from './response-list';

/** TODO: created tools service lib */
@Injectable({
    providedIn: 'root'
})
export class BlogService {

    readonly url = '/api/blog';

    constructor(
        @Inject(HttpClient) private http: HttpClient
    ) { }

    create = (model: BlogModel) => this.http.post<BlogModel>(`${this.url}`, model)

    getBlogs = (request: IRequestBlogs) => this.http.get<IResponseList<BlogModel>>(`${this.url}${this.getQuery(request)}`)

    getBlog = (id: string) => this.http.get<BlogModel>(`${this.url}/${id}`)

    update = (model: BlogModel) => this.http.patch<BlogModel>(`${this.url}`, model)

    delete = (id: string) => this.http.delete<BlogModel>(`${this.url}/${id}`)

    getQuery = (model: { [key: string]: any }): string | null => {
        if (model) {
            const strParams: string[] = Object.keys(model).map((name) => {
                const value = model[name];
                return Array.isArray(value) ?
                    value.map(v => `${encodeURIComponent(name)}=${encodeURIComponent(v)}`).join('&') :
                    `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
            });
            return strParams.length ? `?${strParams.join('&')}` : '';
        }
        return '';
    }
}
