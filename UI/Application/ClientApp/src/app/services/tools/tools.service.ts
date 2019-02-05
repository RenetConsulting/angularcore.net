import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ToolsService {

    constructor() { }

    /** Converts a {@link Object} into a query string */
    getQuery = (model: { [key: string]: any }): string | null => {
        if (model) {
            const strParams: string[] = Object.keys(model).map((name) => {
                const value = model[name];
                return Array.isArray(value) ?
                    value.map(v => `${encodeURIComponent(name)}=${encodeURIComponent(v)}`).join('&') :
                    `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
            });
            return strParams.length ? `?${strParams.join('&')}` : '';
        }
        return null;
    }
}