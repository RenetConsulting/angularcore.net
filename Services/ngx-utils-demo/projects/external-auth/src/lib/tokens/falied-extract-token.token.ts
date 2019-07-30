import { InjectionToken } from '@angular/core';

export const FAILED_EXTRACT_TOKEN_TOKEN = new InjectionToken('falied_extract_token', {
    providedIn: 'root',
    // tslint:disable-next-line: max-line-length
    factory: () => 'Failed extract token. The issue could be occurred by using block plugins such as AdBlock, Privacy Badger and other. Please disable plugins before using the external sign in or add the website to whitelist.'
});
