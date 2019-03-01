import { InjectionToken } from '@angular/core';
import { ICoreCaptchaOptions } from './core-captcha-options';

export const NGX_CORE_CAPTCHA_OPTIONS = new InjectionToken<ICoreCaptchaOptions>('NGX_CORE_CAPTCHA_OPTIONS', {
    providedIn: 'root',
    factory: () => ({})
});
