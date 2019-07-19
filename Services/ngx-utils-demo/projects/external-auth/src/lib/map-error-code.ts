import { ACCESS_DENIED, FAILED_EXTRACT_TOKEN, IMMEDIATE_FAILED, POPUP_CLOSED_BY_USER } from './errors';

export const mapErrorCode = (errorCode: string): string => {
    switch (errorCode) {
        case ACCESS_DENIED: return 'The user denied the permission to the scopes required.';
        // tslint:disable-next-line: max-line-length
        case FAILED_EXTRACT_TOKEN: return 'Failed extract token. The issue could be occurred by using block plugins such as AdBlock, Privacy Badger and other. Please disable plugins before using the external sign in or add the website to whitelist.';
        case IMMEDIATE_FAILED: return 'No user could be automatically selected without prompting the consent flow.';
        case POPUP_CLOSED_BY_USER: return 'The user closed the popup before finishing the sign in flow.';
        default: return null;
    }
};
