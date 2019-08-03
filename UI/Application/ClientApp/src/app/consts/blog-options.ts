import { BlogDefaultOptions } from 'projects/blog/src/public-api';

export class BlogOptions extends BlogDefaultOptions {

    readonly entryBlogUrl = '/api/blog';
    readonly entryFileUrl = '/api/blob';
    readonly entryBlogHubUrl = '/blog';
    readonly count = 10;
}
