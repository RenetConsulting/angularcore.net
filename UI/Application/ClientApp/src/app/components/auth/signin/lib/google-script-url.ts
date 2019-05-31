import { InjectionToken } from '@angular/core';

export const GOOGLE_SCRIPT_URL = new InjectionToken<string>('GOOGLE_SCRIPT_URL', {
    providedIn: 'root',
    factory: () => `//apis.google.com/js/api.js?onload=gAsyncInit`
})
