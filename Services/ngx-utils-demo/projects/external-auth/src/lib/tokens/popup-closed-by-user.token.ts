import { InjectionToken } from '@angular/core';

export const POPUP_CLOSED_BY_USER_TOKEN = new InjectionToken('popup_closed_by_user', {
    providedIn: 'root',
    factory: () => 'The user closed the popup before finishing the sign in flow.'
});
