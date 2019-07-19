import { ACCESS_DENIED, FAILED_EXTRACT_TOKEN, IMMEDIATE_FAILED, POPUP_CLOSED_BY_USER } from './errors';
import { mapErrorCode } from './map-error-code';

describe('mapErrorCode', () => {

    it(ACCESS_DENIED, () => {
        expect(mapErrorCode(ACCESS_DENIED)).toEqual('The user denied the permission to the scopes required.');
    });
    it(FAILED_EXTRACT_TOKEN, () => {
        // tslint:disable-next-line: max-line-length
        expect(mapErrorCode(FAILED_EXTRACT_TOKEN)).toEqual('Failed extract token. The issue could be occurred by using block plugins such as AdBlock, Privacy Badger and other. Please disable plugins before using the external sign in or add the website to whitelist.');
    });
    it(IMMEDIATE_FAILED, () => {
        expect(mapErrorCode(IMMEDIATE_FAILED)).toEqual('No user could be automatically selected without prompting the consent flow.');
    });
    it(POPUP_CLOSED_BY_USER, () => {
        expect(mapErrorCode(POPUP_CLOSED_BY_USER)).toEqual('The user closed the popup before finishing the sign in flow.');
    });
});
