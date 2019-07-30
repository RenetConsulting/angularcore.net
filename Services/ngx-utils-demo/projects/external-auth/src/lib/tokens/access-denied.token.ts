import { InjectionToken } from '@angular/core';

export const ACCESS_DENIED_TOKEN = new InjectionToken('access_denied', {
    providedIn: 'root',
    factory: () => 'The user denied the permission to the scopes required.'
});
