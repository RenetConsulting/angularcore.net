import { InjectionToken } from '@angular/core';

export const NGX_CORE_CAPTCHA_URL = new InjectionToken<string>('NGX_CORE_CAPTCHA_URL', {
    providedIn: 'root',
    factory: () => null
});
