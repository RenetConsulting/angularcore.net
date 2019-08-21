import { InjectionToken } from '@angular/core';

export const IMMEDIATE_FAILED_TOKEN = new InjectionToken('immediate_failed', {
    providedIn: 'root',
    factory: () => 'No user could be automatically selected without prompting the consent flow.'
});
