import { FormGroup } from '@angular/forms';
import { Reset } from '~/actions/root.actions';
import { ChangePasswordError, ChangePasswordRequest, ResetError } from './actions';
import { changePasswordReducer } from './reducer';

describe('changePasswordReducer', () => {

    it('CHANGE_PASSWORD_REQUEST', () => {
        expect(changePasswordReducer({}, new ChangePasswordRequest({} as FormGroup))).toEqual({});
    });
    it('CHANGE_PASSWORD_REQUEST', () => {
        const error = { password: 'bob error' };
        expect(changePasswordReducer({}, new ChangePasswordError(error))).toEqual({ error });
    });
    it('RESET_ERROR', () => {
        expect(changePasswordReducer({}, new ResetError())).toEqual({ error: null });
    });
    it('RESET', () => {
        expect(changePasswordReducer({}, new Reset())).toEqual({});
    });
});