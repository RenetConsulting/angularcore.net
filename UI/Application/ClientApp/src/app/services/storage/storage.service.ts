import { Inject, Injectable } from "@angular/core";

@Injectable()
export class StorageService {

    constructor(
        @Inject("WINDOW") private window: any
    ) { }

    private get storage(): any {
        return this.window && this.window.localStorage;
    }

    private _get = (key: string): string => {
        const storage = this.storage;
        return storage && storage.getItem(key);
    }

    private _set = (key: string, value: string): void => {
        const storage = this.storage;
        if (storage) {
            storage.setItem(key, value);
        }
    }

    remove = (key: string): void => {
        const storage = this.storage;
        if (storage) {
            storage.removeItem(key);
        }
    }

    get = (key: string): any => {
        if (this.storage) {
            const value = this._get(key);
            if (value === null) {
                return null;
            }
            try {
                return JSON.parse(value);
            }
            catch (e) {
                return value;
            }
        }
        return null;
    }

    set = (key: string, value: any): void => {
        if (this.storage) {
            if (typeof value == "string") {
                this._set(key, value);
            }
            else {
                this._set(key, JSON.stringify(value));
            }
        }
    }
}