import { InjectionToken } from '@angular/core';

export const WINDOW = new InjectionToken<any>('BROWSER_WINDOW', {
    providedIn: 'root',
    factory: () => typeof window !== 'undefined' ? window : null
});