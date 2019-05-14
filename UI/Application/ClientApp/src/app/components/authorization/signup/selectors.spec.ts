import { IUser } from '~/interfaces/user';
import { selectSignupError, selectSignupUser } from './selectors';

describe('Signup selectors', () => {

    it('selectSignupError', () => {
        const error = { password: 'bob wrong' };
        expect(selectSignupError({ signup: { error } })).toEqual(error);
    });
    it('selectSignupUser', () => {
        const user = { password: 'bob wrong' } as IUser;
        expect(selectSignupUser({ signup: { user } })).toEqual(user);
    });
});