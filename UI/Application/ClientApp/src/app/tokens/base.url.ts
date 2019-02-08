import { InjectionToken } from '@angular/core';

export const BASE_URL = new InjectionToken<string>('BASE_URL', {
    providedIn: 'root',
    factory: () => {
        if (typeof window !== 'undefined') {
            const port = window.location.port ? `:${window.location.port}` : '';
            return `${window.location.protocol}//${window.location.hostname}${port}`;
        }
        return '';
    }
});