import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Renderer2 } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class NgxLinkStylesheetService {

    constructor(
        @Inject(DOCUMENT) private document,
        @Inject(Renderer2) private renderer: Renderer2,
    ) { }

    create = (className: string) => {
        const element = this.renderer.createElement('link');
        this.renderer.setAttribute(element, 'rel', 'stylesheet');
        this.renderer.addClass(element, className);
        this.renderer.appendChild(this.document.head, element);
        return element;
    }

    get = (className: string) => this.document.head.querySelector(`link[rel="stylesheet"].${className}`);

    update = (className: string, href: string): void => {
        const element = this.get(className) || this.create(className);
        this.renderer.setAttribute(element, 'href', href);
    }

    delete = (className: string): void => {
        const element = this.get(className);
        if (element) {
            this.renderer.removeChild(this.document.head, element);
        }
    }
}
