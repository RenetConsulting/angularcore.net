import { Inject, Injectable } from "@angular/core";
import { TokenModel } from "../../models/token.model";
import { StorageService } from "../storage/storage.service";

@Injectable()
export class TokenService {

    private _token: TokenModel = null;
    /**
     * the key for token model
     */
    private readonly key: string = "tm";

    constructor(
        @Inject(StorageService) private storageService: StorageService
    ) {

    }

    get token(): TokenModel {
        const result = this.storageService.get(this.key);
        return result && result.access_token && result.refresh_token ? result : null;
    }

    set token(value: TokenModel) {
        if (value && value.access_token && value.refresh_token) {
            this._token = value;
            if (this._token.expired_at == null) {
                try {
                    this._token.expired_at = new Date(new Date().valueOf() + 1000 * value.expires_in).toISOString();
                }
                catch (e) {
                    this.clean();
                }
            }
            this.storageService.set(this.key, this._token);
        }
    }

    get isValid(): boolean {
        return this._token && this._token.access_token && !!this.token.refresh_token;
    }

    get isExpired(): boolean {
        let result: boolean = false;
        if (this.isValid) {
            result = new Date().valueOf() > new Date(this._token.expired_at).valueOf();
        }
        return result;
    }

    get header(): string {
        return (this.isValid) ? `${this._token.token_type} ${this._token.access_token}` : "";
    }

    valueByProperty = (key: keyof TokenModel): any => {
        let result: any = null
        if (this._token && key) {
            if (key in this._token) {
                result = this._token[key];
            }
        }
        return result;
    }

    clean = (): void => {
        this.storageService.remove(this.key);
        this._token = null;
    }
}
