import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE } from './local-storage.token';
import { SESSION_STORAGE } from './session-storage.token';

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    /** a key for storage of value - whether we have to use localStorage */
    private readonly key = 'session';
    private storage;

    constructor(
        @Inject(LOCAL_STORAGE) private localStorage,
        @Inject(SESSION_STORAGE) private sessionStorage
    ) {
        const session = this.get(this.key, this.localStorage);
        this.setStorage(session);
    }

    private getItem = (key: string, storage = this.storage): string => storage && storage.getItem(key);

    private setItem = (key: string, value: string, storage = this.storage): void => storage && storage.setItem(key, value);

    /** @param value - is a type of storage that we must use */
    setStorage = (value: boolean): void => {
        this.set(this.key, value, this.localStorage);
        this.storage = value ? this.sessionStorage : this.localStorage;
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
