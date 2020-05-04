import { TestBed } from '@angular/core/testing';
import { ErrorCodeService } from './error-code.service';
import { ACCESS_DENIED, FAILED_EXTRACT_TOKEN, IMMEDIATE_FAILED, POPUP_CLOSED_BY_USER } from './error-codes';

describe('service.map', () => {

    let service: ErrorCodeService;

    beforeEach(() => {

        TestBed.configureTestingModule({});

        service = TestBed.inject(ErrorCodeService);
    });

    it(ACCESS_DENIED, () => {
        expect(service.map(ACCESS_DENIED)).toEqual('The user denied the permission to the scopes required.');
    });
    it(FAILED_EXTRACT_TOKEN, () => {
        // tslint:disable-next-line: max-line-length
        expect(service.map(FAILED_EXTRACT_TOKEN)).toEqual('Sign-in failed. Your browser may be blocking Google cookies.');
    });
    it(IMMEDIATE_FAILED, () => {
        expect(service.map(IMMEDIATE_FAILED)).toEqual('No user could be automatically selected without prompting the consent flow.');
    });
    it(POPUP_CLOSED_BY_USER, () => {
        expect(service.map(POPUP_CLOSED_BY_USER)).toEqual('The user closed the popup before finishing the sign-in process.');
    });
});
