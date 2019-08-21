import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE } from './local-storage.token';
import { SESSION_STORAGE } from './session-storage.token';

/** by default {@link StorageService} uses localStorage */
@Injectable({
    providedIn: 'root'
})
export class StorageService {

    /** a key for storage of value - whether will be used sessionStorage */
    private readonly key = 'sessional';
    private storage;

    constructor(
        @Inject(LOCAL_STORAGE) private localStorage,
        @Inject(SESSION_STORAGE) private sessionStorage
    ) {
        const sessional = this.get(this.key, this.localStorage);
        this.setStorage(sessional);
    }

    private getItem = (key: string, storage = this.storage): string => storage && storage.getItem(key);

    private setItem = (key: string, value: string, storage = this.storage): void => storage && storage.setItem(key, value);

    /** @param sessional - whether will be used sessionStorage */
    setStorage = (sessional: boolean): void => {
        this.set(this.key, sessional, this.localStorage);
        this.storage = sessional ? this.sessionStorage : this.localStorage;
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
