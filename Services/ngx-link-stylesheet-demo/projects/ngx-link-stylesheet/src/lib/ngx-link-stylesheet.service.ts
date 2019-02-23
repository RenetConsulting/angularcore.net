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

    private createLink = (className: string) => {
        const element = this.renderer.createElement('link');
        this.renderer.setAttribute(element, 'rel', 'stylesheet');
        this.renderer.addClass(element, className);
        this.renderer.appendChild(this.document.head, element);
        return element;
    }

    private getLink = (className: string) => this.document.head.querySelector(`link[rel="stylesheet"].${className}`);

    updateLink = (className: string, href: string): void => {
        const element = this.getLink(className) || this.createLink(className);
        this.renderer.setAttribute(element, 'href', href);
    }

    deleteLink = (className: string): void => {
        const element = this.getLink(className);
        if (element) {
            this.renderer.removeChild(this.document.head, element);
        }
    }
}
