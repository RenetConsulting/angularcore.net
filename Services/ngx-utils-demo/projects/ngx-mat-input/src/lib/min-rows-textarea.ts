import { InjectionToken } from '@angular/core';

export const NGX_MIN_ROWS_TEXTAREA = new InjectionToken<number>('NGX_MIN_ROWS_TEXTAREA', {
    providedIn: 'root',
    factory: () => 7
});
