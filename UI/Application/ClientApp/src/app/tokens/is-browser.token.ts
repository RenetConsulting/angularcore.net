import { InjectionToken } from '@angular/core';

export const IS_BROWSER = new InjectionToken<boolean>('IS_BROWSER', {
    providedIn: 'root',
    factory: () => null
});