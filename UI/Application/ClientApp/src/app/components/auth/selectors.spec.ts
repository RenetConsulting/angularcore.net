import { IUser } from '~/interfaces/user';
import { selectAuthorized, selectAuthUser, selectProvider, selectSigninError, selectSignupError } from './selectors';

describe('auth selectors', () => {

    it('selectSigninError', () => {
        const signinError = { password: 'bob wrong' };
        expect(selectSigninError({ auth: { signinError } })).toEqual(signinError);
    });
    it('selectSignupError', () => {
        const signupError = { password: 'bob wrong' };
        expect(selectSignupError({ auth: { signupError } })).toEqual(signupError);
    });
    it('selectAuthUser', () => {
        const user = { password: 'bob wrong' } as IUser;
        expect(selectAuthUser({ auth: { user } })).toEqual(user);
    });
    it('selectAuthorized', () => {
        const authorized = true;
        expect(selectAuthorized({ auth: { authorized } })).toEqual(authorized);
    });
    it('selectProvider', () => {
        const provider = 'bob';
        expect(selectProvider({ auth: { provider } })).toEqual(provider);
    });
});