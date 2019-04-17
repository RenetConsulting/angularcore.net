import { InjectionToken } from '@angular/core';
import { IBlogOptions } from './blog-options';

export const BLOG_DEFAULT_OPTIONS = new InjectionToken<IBlogOptions>('mat-tooltip-default-options', {
    providedIn: 'root',
    factory: () => ({
        entryBlogUrl: null,
        entryFileUrl: null,
    })
});