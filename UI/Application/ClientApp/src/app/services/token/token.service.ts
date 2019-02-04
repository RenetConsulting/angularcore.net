import { Inject, Injectable } from "@angular/core";
import { IToken } from "../../interfaces/token";
import { StorageService } from "../storage/storage.service";

@Injectable({
    providedIn: "root"
})
export class TokenService {

    /**
     * the key for token model
     */
    private readonly key: string = "tm";

    constructor(
        @Inject(StorageService) private storageService: StorageService
    ) { }

    get token(): IToken {
        const item = this.storageService.get(this.key);
        return (item && item.access_token && item.refresh_token) ? item : null;
    }

    set token(value: IToken) {
        if (value && value.access_token && value.refresh_token) {
            if (value.expired_at) {
                value.expired_at = new Date(new Date().valueOf() + 1000 * value.expires_in).toISOString();
            }
            this.storageService.set(this.key, value);
        }
    }

    get isValid(): boolean {
        if (this.token) {
            const item = this.token;
            return item && item.access_token && !!item.refresh_token;
        }
        else {
            return false;
        }
    }

    get isExpired(): boolean {
        let result: boolean = false;
        if (this.isValid) {
            result = new Date().valueOf() > new Date(this.token.expired_at).valueOf();
        }
        return result;
    }

    get header(): string {
        const item = this.token;
        return this.isValid ? `${item.token_type} ${item.access_token}` : "";
    }

    valueByProperty = (key: keyof IToken): any => {
        const item = this.token;
        return (key && item && key in item) ? item[key] : null;
    }

    clean = (): void => {
        this.storageService.remove(this.key);
    }
}