import { InjectionToken } from '@angular/core';

export const SESSION_STORAGE = new InjectionToken<any>('SESSION_STORAGE', {
    providedIn: 'root',
    factory: () => typeof window !== 'undefined' ? window.sessionStorage : null
});