import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BlogModel } from './blog.model';

@Injectable({
    providedIn: 'root'
})
export class BlogService {

    readonly url = '/api/blog';

    constructor(
        @Inject(HttpClient) private http: HttpClient
    ) { }

    getBlogs = () => this.http.get<Array<BlogModel>>(this.url)

    getBlog = (id: string) => this.http.get<BlogModel>(`${this.url}/${id}`)

    delete = (id: string) => this.http.delete<BlogModel>(`${this.url}/${id}`)

    update = (model: BlogModel) => this.http.patch<BlogModel>(`${this.url}`, model)
}
