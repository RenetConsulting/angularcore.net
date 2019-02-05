import { InjectionToken } from '@angular/core';

export const LOCAL_STORAGE = new InjectionToken<any>('LOCAL_STORAGE', {
    providedIn: 'root',
    factory: () => typeof window !== 'undefined' ? window.localStorage : null
});