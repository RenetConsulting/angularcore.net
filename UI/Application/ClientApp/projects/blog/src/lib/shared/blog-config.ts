import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class BlogConfig {

    /** amount of time viewing modified blog (ms) */
    readonly amountOfTimeViewingModifiedBlog: number = 5000;
    entryBlogUrl: string;
    entryFileUrl: string;
    entryBlogHubUrl: string;
    count: number;
}
