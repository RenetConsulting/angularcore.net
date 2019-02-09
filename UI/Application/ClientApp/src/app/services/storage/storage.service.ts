import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE } from '../../tokens/local.storage';
import { SESSION_STORAGE } from '../../tokens/session.storage';

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    private storage;
    private readonly storageTypeKey = 'storage.iru';

    constructor(
        @Inject(LOCAL_STORAGE) private localSorage,
        @Inject(SESSION_STORAGE) private sessionSorage
    ) {
        this.setStorage(this.get(this.storageTypeKey, this.localSorage));
    }

    private getItem = (key: string, storage = this.storage): string => {
        return storage && storage.getItem(key);
    }

    private setItem = (key: string, value: string, storage = this.storage): void => {
        if (storage) {
            storage.setItem(key, value);
        }
    }

    /**
     * by default, the storage must be local storage unless a user logins with another Browser
     * @param isLocalSorage - is a type of storage that we must use
     */
    setStorage = (isLocalSorage: boolean = true): void => {
        this.set(this.storageTypeKey, isLocalSorage, this.localSorage);
        this.storage = isLocalSorage ? this.localSorage : this.sessionSorage;
    }

    remove = (key: string, storage = this.storage): void => {
        if (storage) {
            storage.removeItem(key);
        }
    }

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