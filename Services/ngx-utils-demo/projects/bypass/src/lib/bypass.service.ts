import { Inject, Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeResourceUrl, SafeScript, SafeStyle, SafeUrl } from '@angular/platform-browser';
import { BYPASS_TOKEN } from './bypass.token';
import { BypassType } from './bypass.type';

@Injectable({
    providedIn: 'root'
})
export class BypassService {

    constructor(
        @Inject(DomSanitizer) private sanitizer: DomSanitizer,
        @Inject(BYPASS_TOKEN) private type: BypassType,
    ) { }

    map = (value: string, type: BypassType = this.type) => this.bypass(value, type);

    bypass = (value: string, type: BypassType): SafeHtml | SafeResourceUrl | SafeScript | SafeStyle | SafeUrl => {
        switch (type) {
            case BypassType.Html: return this.sanitizer.bypassSecurityTrustHtml(value);
            case BypassType.ResourceUrl: return this.sanitizer.bypassSecurityTrustResourceUrl(value);
            case BypassType.Script: return this.sanitizer.bypassSecurityTrustScript(value);
            case BypassType.Style: return this.sanitizer.bypassSecurityTrustStyle(value);
            case BypassType.Url: return this.sanitizer.bypassSecurityTrustUrl(value);
            default: return null;
        }
    }
}
