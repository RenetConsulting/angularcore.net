import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { NgxHttpParamsService } from '@renet-consulting/ngx-utils';
import { BlogModel } from './blog.model';
import { IRequestBlogs } from './request-blogs';
import { IResponseList } from './response-list';

@Injectable({
    providedIn: 'root'
})
export class BlogService {

    readonly url = '/api/blog';

    constructor(
        @Inject(HttpClient) private http: HttpClient,
        @Inject(NgxHttpParamsService) private params: NgxHttpParamsService,
    ) { }

    create = (model: BlogModel) => this.http
        .post<BlogModel>(`${this.url}`, model)

    getBlogs = (request: IRequestBlogs) => this.http
        .get<IResponseList<BlogModel>>(`${this.url}`, { params: this.params.getParams(request) })

    getBlog = (id: string) => this.http
        .get<BlogModel>(`${this.url}/${id}`)

    update = (model: BlogModel) => this.http
        .patch<BlogModel>(`${this.url}`, model)

    delete = (id: string) => this.http
        .delete<BlogModel>(`${this.url}/${id}`)
}
