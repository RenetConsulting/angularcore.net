import { InjectionToken } from '@angular/core';

export const NGX_MAX_ROWS_TEXTAREA = new InjectionToken<number>('NGX_MAX_ROWS_TEXTAREA', {
    providedIn: 'root',
    factory: () => 15
});
