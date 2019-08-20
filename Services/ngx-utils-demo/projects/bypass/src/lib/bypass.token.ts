import { InjectionToken } from '@angular/core';
import { BypassType } from './bypass.type';

export const BYPASS_TOKEN = new InjectionToken<BypassType>('bypass_token', {
    providedIn: 'root',
    factory: () => BypassType.Html
});
