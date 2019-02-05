import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE } from '../../tokens/local.storage';

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    constructor(
        @Inject(LOCAL_STORAGE) private storage: any
    ) { }

    private getItem = (key: string): string => {
        return this.storage && this.storage.getItem(key);
    }

    private setItem = (key: string, value: string): void => {
        if (this.storage) {
            this.storage.setItem(key, value);
        }
    }

    remove = (key: string): void => {
        if (this.storage) {
            this.storage.removeItem(key);
        }
    }

    get = (key: string): any => {
        if (this.storage) {
            const value = this.getItem(key);
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
            if (typeof value === 'string') {
                this.setItem(key, value);
            }
            else {
                this.setItem(key, JSON.stringify(value));
            }
        }
    }
}