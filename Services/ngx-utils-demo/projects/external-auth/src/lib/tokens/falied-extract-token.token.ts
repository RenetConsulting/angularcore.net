import { InjectionToken } from '@angular/core';

export const FAILED_EXTRACT_TOKEN_TOKEN = new InjectionToken('falied_extract_token', {
    providedIn: 'root',
    factory: () => 'Sign-in failed. Your browser may be blocking Google cookies.'
});
