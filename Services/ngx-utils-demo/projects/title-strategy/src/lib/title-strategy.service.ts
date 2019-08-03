import { Inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Data } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class TitleStrategyService {

    constructor(
        @Inject(Title) private title: Title
    ) { }

    set = (value: Data) => {
        this.title.setTitle(value.title);
    }
}
