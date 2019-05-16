import { selectChangePasswordError } from './selectors';

describe('ChangePassword selectors', () => {

    it('selectChangePasswordError', () => {
        const error = { password: 'bob wrong' };
        expect(selectChangePasswordError({ changePassword: { error } })).toEqual(error);
    });
});