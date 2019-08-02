import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { NgxHttpParamsService } from '@renet-consulting/ngx-http-params';
import { getFormData } from '@renet-consulting/ngx-uploader';
import { IBlogOptions } from '../blog-options';
import { BLOG_DEFAULT_OPTIONS } from '../blog-options.token';
import { IResponseList } from '../response-list';
import { FileModel } from './file.model';
import { IRequestBlogLists } from './request-blob-list';
import { BlogModel } from '../blog.model';

@Injectable({
    providedIn: 'root'
})
export class FileService {

    url: string;

    constructor(
        @Inject(HttpClient) private http: HttpClient,
        @Inject(NgxHttpParamsService) private params: NgxHttpParamsService,
        @Inject(BLOG_DEFAULT_OPTIONS) options: IBlogOptions,
    ) {
        this.url = options.entryFileUrl;
    }

    upload = (blogId: string, items: FileList) => this.http
        .post<FileModel>(`${this.url}`, getFormData(items), { params: this.params.map({ blogId } as BlogModel) })

    getFiles = (request: IRequestBlogLists) => this.http
        .get<IResponseList<FileModel>>(`${this.url}`, { params: this.params.map(request) })

    delete = (id: string) => this.http
        .delete<boolean>(`${this.url}/${id}`)
}
