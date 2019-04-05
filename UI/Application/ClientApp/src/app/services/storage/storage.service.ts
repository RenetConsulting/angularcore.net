import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE } from '~/tokens/local-storage.token';
import { SESSION_STORAGE } from '~/tokens/session-storage.token';

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    /** key - is remember user */
    private readonly key = 'storage.iru';
    private storage;

    constructor(
        @Inject(LOCAL_STORAGE) private localStorage,
        @Inject(SESSION_STORAGE) private sessionStorage
    ) {
        this.setStorage(this.get(this.key, this.localStorage));
    }

    private getItem = (key: string, storage = this.storage): string => storage && storage.getItem(key);

    private setItem = (key: string, value: string, storage = this.storage): void => storage && storage.setItem(key, value);

    /** @param value - is a type of storage that we must use */
    setStorage = (value: boolean): void => {
        this.set(this.key, value, this.localStorage);
        this.storage = value ? this.localStorage : this.sessionStorage;
    }

    remove = (key: string, storage = this.storage): void => storage && storage.removeItem(key);

    get = (key: string, storage = this.storage): any => {
        if (storage) {
            const value = this.getItem(key, storage);
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

    set = (key: string, value: any, storage = this.storage): void => {
        if (storage) {
            if (typeof value === 'string') {
                this.setItem(key, value, storage);
            }
            else {
                this.setItem(key, JSON.stringify(value), storage);
            }
        }
    }
}