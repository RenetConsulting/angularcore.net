import { selectResetPasswordError } from './selectors';

describe('ResetPassword selectors', () => {

    it('selectResetPasswordError', () => {
        const error = { password: 'bob wrong' };
        expect(selectResetPasswordError({ resetPassword: { error } })).toEqual(error);
    });
});