import { Inject, Injectable } from '@angular/core';
import { StorageService } from '@renet-consulting/storage';
import { IToken } from './token';

@Injectable({
    providedIn: 'root'
})
export class TokenService {

    private readonly key = 'token';
    private _token: IToken;

    constructor(
        @Inject(StorageService) private storage: StorageService
    ) { }

    private get token(): IToken {
        if (!this._token) {
            this._token = this.storage.get(this.key);
        }
        return this._token && this._token.access_token && this._token.refresh_token ? this._token : null;
    }

    get valid(): boolean {
        const item = this.token;
        return item && item.access_token && !!item.refresh_token;
    }

    get expired(): boolean {
        return this.valid ? new Date().valueOf() >= new Date(this.token.expired_at || 0).valueOf() : false;
    }

    get header(): { [k: string]: string } {
        const item = this.token;
        return this.valid ? { authorization: `${item.token_type} ${item.access_token}` } : null;
    }

    get = <Key extends keyof IToken>(key: Key): IToken[Key] => {
        const item = this.token;
        return item && item[key];
    }

    setToken = (value: IToken, date = new Date()): void => {
        const token = { ...value };
        if (token.access_token && token.refresh_token) {
            if (token.expires_in) {
                token.expired_at = date.setTime(date.valueOf() + 1000 * token.expires_in).toString();
            }
            this._token = { ...token };
            this.storage.set(this.key, token);
        }
    }

    clean = (): void => {
        this._token = null;
        this.storage.remove(this.key);
    }
}
