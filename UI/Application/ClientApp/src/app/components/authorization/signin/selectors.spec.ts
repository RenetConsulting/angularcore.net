import { IUser } from '~/interfaces/user';
import { selectSigninError, selectSigninUser } from './selectors';

describe('Signin selectors', () => {

    it('selectSigninError', () => {
        const error = { password: 'bob wrong' };
        expect(selectSigninError({ signin: { error } })).toEqual(error);
    });
    it('selectSigninUser', () => {
        const user = { password: 'bob wrong' } as IUser;
        expect(selectSigninUser({ signin: { user } })).toEqual(user);
    });
});