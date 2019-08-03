import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { NgxHttpParamsService } from '@renet-consulting/ngx-http-params';
import { getFormData } from '@renet-consulting/ngx-uploader';
import { BlogDefaultOptions } from '../blog-default-options';
import { IRequestList } from '../request-list';
import { IResponseList } from '../response-list';
import { FileModel } from './file.model';

@Injectable({
    providedIn: 'root'
})
export class FileService {

    url: string;

    constructor(
        @Inject(HttpClient) private http: HttpClient,
        @Inject(NgxHttpParamsService) private params: NgxHttpParamsService,
        @Inject(BlogDefaultOptions) options: BlogDefaultOptions,
    ) {
        this.url = options.entryFileUrl;
    }

    upload = (items: FileList) => this.http
        .post<IResponseList<FileModel>>(`${this.url}`, getFormData(items))

    getFiles = (request: IRequestList) => this.http
        .get<IResponseList<FileModel>>(`${this.url}`, { params: this.params.map(request) })

    delete = (id: string) => this.http
        .delete<boolean>(`${this.url}/${id}`)
}
