import { Inject, Injectable } from "@angular/core";

@Injectable()
export class LocalStorageService {

    constructor(
        @Inject("WINDOW") private window: any
    ) { }

    clear = (): void => {
        if (this.window != null) {
            this.window.localStorage.clear();
        }
    }

    setItem = (key: string, value: string): void => {
        if (this.window != null) {
            this.window.localStorage.setItem(key, value);
        }
    }

    getItem = (key: string): string => {
        if (this.window != null) {
            return this.window.localStorage.getItem(key);
        }
        return null;
    }

    setObject = (key: string, value: Object): void => {
        if (this.window != null) {
            if (typeof value === "string" || typeof value === "number") {
                this.setItem(key, value as string);
            } else {
                this.setItem(key, JSON.stringify(value));
            }
        }
    }

    getObject = (key: string): any => {
        if (this.window != null) {
            let item = this.getItem(key);
            try {
                return JSON.parse(item);
            } catch (event) {
                return item;
            }
        }
        return null;
    }

    removeItem = (key: string): void => {
        if (this.window != null) {
            this.window.localStorage.removeItem(key);
        }
    }
}
