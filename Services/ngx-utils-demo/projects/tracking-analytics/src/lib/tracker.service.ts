import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { NgxHttpParamsService } from '@renet-consulting/ngx-http-params';
import { StorageService } from '@renet-consulting/storage';
import { AES, CipherOption, enc, mode, pad } from 'crypto-js';
import { TrackerModel } from './tracker.model';

/** descriptions of keys see in the https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters */
@Injectable({
    providedIn: 'root',
})
export class NgxTrackerService {

    readonly clientIdKey = '_ga';
    readonly keySize: number = 16;
    private window: any = typeof window !== 'undefined' ? window : null;

    constructor(
        @Inject(DOCUMENT) private document: any,
        @Inject(PLATFORM_ID) private platformId: any,
        @Inject(StorageService) private storageService: StorageService,
        @Inject(NgxHttpParamsService) private params: NgxHttpParamsService
    ) { }

    get randomValue(): string {
        let result = (parseInt(`${1125899839733759 * Math.random()}`, 10)).toString();
        result += (parseInt(`${1125899839733759 * Math.random()}`, 10)).toString();
        result = result.substring(0, this.keySize);
        return result;
    }

    /**
     * Client ID
     * Optional.
     * This field is required if User ID (uid) is not specified in the request.
     * This anonymously identifies a particular user, device, or browser instance.
     * For the web, this is generally stored as a first-party cookie with a two-year expiration.
     * For mobile apps, this is randomly generated for each particular instance of an application install.
     * The value of this field should be a random UUID (version 4) as described in http://www.ietf.org/rfc/rfc4122.txt.
     */
    get cid(): string {
        let result: string = null;
        if (this.document && isPlatformBrowser(this.platformId)) {
            const cookie: string = this.document.cookie;
            if (typeof cookie === 'string' && cookie.indexOf(this.clientIdKey) > -1) {
                const cookies: Array<string> = cookie.split('; ');
                if (Array.isArray(cookies)) {
                    for (const cooky of cookies) {
                        const item: Array<string> = cooky.split('=');
                        if (Array.isArray(item)) {
                            const key: string = item[0];
                            const value: string = item[1] || '';
                            if (this.clientIdKey === key) {
                                const matches: RegExpMatchArray = value.match(new RegExp('\\d\{5\,14\}\\.\\d\{5\,14\}', 'gi'));
                                if (Array.isArray(matches)) {
                                    result = matches[0];
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }
        if (!result) {
            result = this.storageService.get(this.clientIdKey);
            if (!result) {
                result = `${this.randomValue.substr(0, 10)}.${this.randomValue.substr(0, 10)}`;
                this.storageService.set(this.clientIdKey, result);
            }
        }
        return result;
    }

    /**
     * Document Encoding
     * Optional.
     * Specifies the character set used to encode the page / document.
     */
    get de(): string {
        let result: string = null;
        if (this.document && isPlatformBrowser(this.platformId)) {
            result = this.document.characterSet || this.document.charset;
        }
        return result;
    }

    /**
     * User Language
     * Optional.
     * Specifies the language.
     */
    get ul(): string {
        let result: string = null;
        if (this.window && this.window.navigator && isPlatformBrowser(this.platformId)) {
            const navigator = this.window.navigator;
            result = navigator && (navigator.language || navigator.browserLanguage) || '';
            result = result.toLowerCase();
        }
        return result;
    }

    /**
     * Screen Colors
     * Optional.
     * Specifies the screen color depth.
     */
    get sd(): string {
        let result: string = null;
        if (this.window && this.window.screen && isPlatformBrowser(this.platformId)) {
            result = `${this.window.screen.colorDepth}-bit`;
        }
        return result;
    }

    /**
     * Screen Resolution
     * Optional.
     * Specifies the screen resolution.
     */
    get sr(): string {
        let result: string = null;
        if (this.window && this.window.screen && isPlatformBrowser(this.platformId)) {
            result = `${this.window.screen.width + 'x' + this.window.screen.height}`;
        }
        return result;
    }

    /**
     * Viewport size
     * Optional.
     * Specifies the viewable area of the browser / device.
     */
    get vp(): string {
        let result: string = null;
        if (this.document && isPlatformBrowser(this.platformId)) {
            const documentElement: HTMLElement = this.document.documentElement;
            if (documentElement) {
                result = `${documentElement.clientWidth + 'x' + documentElement.clientHeight}`;
            }
        }
        return result;
    }

    get trackerModel(): TrackerModel {
        return {
            ...new TrackerModel(),
            cid: this.cid,
            de: this.de,
            sd: this.sd,
            sr: this.sr,
            ul: this.ul,
            vp: this.vp,
            z: this.randomValue.substr(0, 10)
        };
    }

    encrypt = (item: TrackerModel, keyId: string, ivId: string): string => {
        const req = ['?', this.params.map(item).toString()].join('');
        const key = enc.Utf8.parse(keyId); // secret key
        const iv = enc.Utf8.parse(ivId); // 16 digit
        const reqUTF8 = enc.Utf8.parse(req);
        const option: CipherOption = {
            keySize: this.keySize,
            iv,
            mode: mode.CBC,
            padding: pad.Pkcs7
        };
        const encryptedText = AES.encrypt(reqUTF8, key, option);
        return encryptedText.toString();
    }
}
