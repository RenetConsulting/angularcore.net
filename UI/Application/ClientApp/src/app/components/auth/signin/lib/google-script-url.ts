import { InjectionToken } from '@angular/core';

/** make sure that the query string matches with the name of the function */
export const GOOGLE_SCRIPT_URL = new InjectionToken<string>('GOOGLE_SCRIPT_URL', {
    providedIn: 'root',
    factory: () => `//apis.google.com/js/api.js?onload=gAsyncInit`
});
