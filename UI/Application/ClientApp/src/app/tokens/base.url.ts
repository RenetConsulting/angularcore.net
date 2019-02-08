import { InjectionToken } from '@angular/core';

export const BASE_URL = new InjectionToken<string>('BASE_URL', {
    providedIn: 'root',
    factory: () => typeof window !== 'undefined' ?
        window.location.protocol + '//' + window.location.hostname + ((window.location.port) ? ':' + window.location.port : '') : ''
});