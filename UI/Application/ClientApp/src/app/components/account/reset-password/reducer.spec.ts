import { Reset } from '~/actions/root.actions';
import { ResetError, ResetPasswordError, ResetPasswordRequest } from './actions';
import { resetPasswordReducer } from './reducer';

describe('resetPasswordReducer', () => {

    it('RESET_PASSWORD_REQUEST', () => {
        expect(resetPasswordReducer({}, new ResetPasswordRequest(null))).toEqual({});
    });
    it('RESET_PASSWORD_ERROR', () => {
        const error = { error: 'bob' };
        expect(resetPasswordReducer({}, new ResetPasswordError(error))).toEqual({ error });
    });
    it('RESET_PASSWORD_ERROR', () => {
        expect(resetPasswordReducer({}, new ResetError())).toEqual({ error: null });
    });
    it('RESET_PASSWORD_ERROR', () => {
        expect(resetPasswordReducer({}, new Reset())).toEqual({});
    });
    it('default', () => {
        expect(resetPasswordReducer({}, { type: null })).toEqual({});
    });
});