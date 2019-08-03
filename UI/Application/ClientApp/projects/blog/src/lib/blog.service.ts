import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { NgxHttpParamsService } from '@renet-consulting/ngx-http-params';
import { BlogDefaultOptions } from './blog-default-options';
import { BlogModel } from './blog.model';
import { IRequestList } from './request-list';
import { IResponseList } from './response-list';

@Injectable({
    providedIn: 'root'
})
export class BlogService {

    url: string;

    constructor(
        @Inject(HttpClient) private http: HttpClient,
        @Inject(NgxHttpParamsService) private params: NgxHttpParamsService,
        @Inject(BlogDefaultOptions) options: BlogDefaultOptions,
    ) {
        this.url = options.entryBlogUrl;
    }

    create = (model: BlogModel) => this.http
        .post<BlogModel>(`${this.url}`, model)

    getBlogs = (request: IRequestList) => this.http
        .get<IResponseList<BlogModel>>(`${this.url}`, { params: this.params.map(request) })

    getBlog = (id: string) => this.http
        .get<BlogModel>(`${this.url}/${id}`)

    update = (model: BlogModel) => this.http
        .patch<boolean>(`${this.url}`, model)

    delete = (id: string) => this.http
        .delete<boolean>(`${this.url}/${id}`)
}
