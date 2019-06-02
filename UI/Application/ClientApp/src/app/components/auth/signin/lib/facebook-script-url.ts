import { InjectionToken } from '@angular/core';

export const FACEBOOK_SCRIPT_URL = new InjectionToken<string>('FACEBOOK_SCRIPT_URL', {
    providedIn: 'root',
    factory: () => '//connect.facebook.net/en_US/sdk.js'
});
