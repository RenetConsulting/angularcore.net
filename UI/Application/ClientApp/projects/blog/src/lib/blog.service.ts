import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { NgxHttpParamsService } from '@renet-consulting/ngx-http-params';
import { IBlogOptions } from './blog-options';
import { BLOG_DEFAULT_OPTIONS } from './blog-options.token';
import { BlogModel } from './blog.model';
import { IResponseList } from './response-list';
import { IRequestList } from './request-list';

@Injectable({
    providedIn: 'root'
})
export class BlogService {

    private url: string;

    constructor(
        @Inject(HttpClient) private http: HttpClient,
        @Inject(NgxHttpParamsService) private params: NgxHttpParamsService,
        @Inject(BLOG_DEFAULT_OPTIONS) options: IBlogOptions,
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
