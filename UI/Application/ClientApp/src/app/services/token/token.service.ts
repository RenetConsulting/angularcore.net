import { Inject, Injectable } from '@angular/core';
import { StorageService } from '@renet-consulting/storage';
import { IToken } from '~/interfaces/token';

@Injectable({
    providedIn: 'root'
})
export class TokenService {

    /** the key for storage */
    private readonly key: string = 'token';
    private _token: IToken;

    constructor(
        @Inject(StorageService) private storageService: StorageService
    ) { }

    private get token(): IToken {
        // return this._token = this.storageService.get(this.key);
        if (!this._token) {
            this._token = this.storageService.get(this.key);
        }
        return this._token && this._token.access_token && this._token.refresh_token ? this._token : null;
    }

    get valid(): boolean {
        const item = this.token;
        return item && item.access_token && !!item.refresh_token;
    }

    get expired(): boolean {
        let result = false;
        if (this.valid) {
            result = new Date().valueOf() > new Date(this.token.expired_at || 0).valueOf();
        }
        return result;
    }

    get header(): { [k: string]: string } | null {
        const item = this.token;
        return this.valid ? { auth: `${item.token_type} ${item.access_token}` } : null;
    }

    get = <Key extends keyof IToken>(key: Key): IToken[Key] => {
        const item = this.token;
        return item && item[key];
    }

    setToken = (value: IToken): void => {
        const token = { ...value };
        if (token.access_token && token.refresh_token) {
            if (token.expires_in) {
                token.expired_at = new Date(new Date().valueOf() + 1000 * token.expires_in).toISOString();
            }
            this._token = { ...token };
            this.storageService.set(this.key, token);
        }
    }

    clean = (): void => {
        this._token = null;
        this.storageService.remove(this.key);
    }
}