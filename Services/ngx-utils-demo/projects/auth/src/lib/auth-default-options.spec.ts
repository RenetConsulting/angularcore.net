import { TestBed } from '@angular/core/testing';
import { AuthDefaultOptions } from './auth-default-options';

describe('AuthDefaultOptions', () => {

    let options: AuthDefaultOptions;

    beforeEach(() => {
        TestBed.configureTestingModule({});

        options = TestBed.inject(AuthDefaultOptions);
    });

    it('should be created', () => {
        expect(options).toBeTruthy();
    });
    it('apiRefreshToken', () => {
        expect(options.apiRefreshToken).toEqual('/connect/token');
    });
    it('apiSignin', () => {
        expect(options.apiSignin).toEqual('/connect/token');
    });
    it('apiSignout', () => {
        expect(options.apiSignout).toEqual('/connect/signout');
    });
    it('apiSignup', () => {
        expect(options.apiSignup).toEqual('/api/account/register');
    });
});
