import { Inject, Injectable } from '@angular/core';
import { BlogDefaultOptions } from 'projects/blog/src/public-api';
import { BASE_URL } from '~/tokens/base-url.token';

@Injectable()
export class BlogOptions extends BlogDefaultOptions {

    readonly entryBlogUrl = '/api/blog';
    readonly entryFileUrl = '/api/blob';
    readonly entryBlogHubUrl = `${this.baseUrl}/blog`;
    readonly count = 10;

    constructor(
        @Inject(BASE_URL) private baseUrl: string
    ) {
        super();
    }
}
