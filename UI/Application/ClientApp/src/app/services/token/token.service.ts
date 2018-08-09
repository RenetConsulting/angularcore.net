import { Inject, Injectable } from "@angular/core";
import { ResponseTokenModel } from "../../models/response.token";
import { LocalStorageService } from "../local.storage/local.storage.service";

@Injectable()
export class TokenService {

    private _token: ResponseTokenModel = null;
    /**
     * the key for token model
     */
    private readonly key: string = "tm";

    constructor(
        @Inject(LocalStorageService) private localStorageService: LocalStorageService
    ) {
        this.token = this.localStorageService.getObject(this.key);
    }

    get token(): ResponseTokenModel {
        return (this._token != null && this._token.access_token != null && this._token.refresh_token != null) ? new ResponseTokenModel(this._token) : null;
    }

    set token(value: ResponseTokenModel) {
        if (value != null && value.access_token != null && value.refresh_token != null) {
            this._token = value;
            if (this._token.expired_at == null) {
                try {
                    this._token.expired_at = new Date(new Date().valueOf() + 1000 * value.expires_in).toISOString();
                }
                catch (e) {
                    this.clean();
                }
            }
            this.localStorageService.setObject(this.key, this._token);
        }
    }

    get isValid(): boolean {
        let result: boolean = false;
        if (this._token != null) {
            result = this._token.access_token != null && this.token.refresh_token != null;
        }
        return result;
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

    valueByProperty = (key: keyof ResponseTokenModel): any => {
        let result: any = null
        if (this._token != null && key != null) {
            if (key in this._token) {
                result = this._token[key];
            }
        }
        return result;
    }

    clean = (): void => {
        this.localStorageService.removeItem(this.key);
        this._token = null;
    }
}
