import { Inject, Injectable } from '@angular/core';
import { IToken } from '../../interfaces/token';
import { StorageService } from '../storage/storage.service';

@Injectable({
    providedIn: 'root'
})
export class TokenService {

    /** the key for token */
    private readonly key: string = 'token.tm';
    private _token: IToken;

    constructor(
        @Inject(StorageService) private storageService: StorageService
    ) { }

    private get token(): IToken {
        if (!this._token) {
            this._token = this.storageService.get(this.key);
        }
        return this._token && this._token.access_token && this._token.refresh_token ? this._token : null;
    }

    get isValid(): boolean {
        const item = this.token;
        return item && item.access_token && !!item.refresh_token;
    }

    get isExpired(): boolean {
        let result = false;
        if (this.isValid) {
            result = new Date().valueOf() > new Date(this.token.expired_at || 0).valueOf();
        }
        return result;
    }

    get header(): string {
        const item = this.token;
        return this.isValid ? `${item.token_type} ${item.access_token}` : '';
    }

    setToken = (value: IToken) => {
        const token = { ...value };
        if (token && token.access_token && token.refresh_token) {
            if (token.expires_in) {
                token.expired_at = new Date(new Date().valueOf() + 1000 * token.expires_in).toISOString();
            }
            this._token = { ...token };
            this.storageService.set(this.key, token);
        }
    }

    getValue = (key: keyof IToken): any => {
        const item = this.token;
        return (key && item && key in item) ? item[key] : null;
    }

    clean = (): void => {
        this._token = null;
        this.storageService.remove(this.key);
    }
}