import { Inject, Injectable } from '@angular/core';
import { ACCESS_DENIED, FAILED_EXTRACT_TOKEN, IMMEDIATE_FAILED, POPUP_CLOSED_BY_USER } from './error-codes';
import { ACCESS_DENIED_TOKEN } from './tokens/access-denied.token';
import { FAILED_EXTRACT_TOKEN_TOKEN } from './tokens/falied-extract-token.token';
import { IMMEDIATE_FAILED_TOKEN } from './tokens/immediate-failed.token';
import { POPUP_CLOSED_BY_USER_TOKEN } from './tokens/popup-closed-by-user.token';

@Injectable({
    providedIn: 'root'
})
export class ErrorCodeService {

    constructor(
        @Inject(ACCESS_DENIED_TOKEN) private accessDenied: string,
        @Inject(FAILED_EXTRACT_TOKEN_TOKEN) private faliedExtractToken: string,
        @Inject(IMMEDIATE_FAILED_TOKEN) private immediateFailed: string,
        @Inject(POPUP_CLOSED_BY_USER_TOKEN) private popupClosedByUser: string,
    ) { }

    map = (errorCode: string): string => {
        switch (errorCode) {
            case ACCESS_DENIED: return this.accessDenied;
            case FAILED_EXTRACT_TOKEN: return this.faliedExtractToken;
            case IMMEDIATE_FAILED: return this.immediateFailed;
            case POPUP_CLOSED_BY_USER: return this.popupClosedByUser;
            default: return null;
        }
    }
}
