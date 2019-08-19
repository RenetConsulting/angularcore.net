import { Inject, Injectable, Optional } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Data } from '@angular/router';
import { DEFAULT_TITLE_TOKEN } from './default-title.token';

@Injectable({
    providedIn: 'root'
})
export class TitleStrategyService {

    constructor(
        @Inject(Title) private title: Title,
        @Inject(DEFAULT_TITLE_TOKEN) @Optional() private defaultTitle: string
    ) { }

    set = (value: Data) => {
        const title = value.title || this.defaultTitle;
        if (title) {
            this.title.setTitle(title);
        }
    }
}
