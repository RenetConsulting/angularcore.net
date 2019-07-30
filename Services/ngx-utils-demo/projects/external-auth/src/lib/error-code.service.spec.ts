import { TestBed } from '@angular/core/testing';
import { ErrorCodeService } from './error-code.service';
import { ACCESS_DENIED, FAILED_EXTRACT_TOKEN, IMMEDIATE_FAILED, POPUP_CLOSED_BY_USER } from './error-codes';

describe('service.map', () => {

    let service: ErrorCodeService;

    beforeEach(() => {

        TestBed.configureTestingModule({});

        service = TestBed.get(ErrorCodeService);
    });

    it(ACCESS_DENIED, () => {
        expect(service.map(ACCESS_DENIED)).toEqual('The user denied the permission to the scopes required.');
    });
    it(FAILED_EXTRACT_TOKEN, () => {
        // tslint:disable-next-line: max-line-length
        expect(service.map(FAILED_EXTRACT_TOKEN)).toEqual('Failed extract token. The issue could be occurred by using block plugins such as AdBlock, Privacy Badger and other. Please disable plugins before using the external sign in or add the website to whitelist.');
    });
    it(IMMEDIATE_FAILED, () => {
        expect(service.map(IMMEDIATE_FAILED)).toEqual('No user could be automatically selected without prompting the consent flow.');
    });
    it(POPUP_CLOSED_BY_USER, () => {
        expect(service.map(POPUP_CLOSED_BY_USER)).toEqual('The user closed the popup before finishing the sign in flow.');
    });
});
