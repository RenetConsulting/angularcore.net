import { FormGroup } from '@angular/forms';
import { Reset } from '~/actions/root.actions';
import { IUser } from '~/interfaces/user';
import { ResetError, SigninError, SigninRequest } from './actions';
import { signinReducer } from './reducer';

describe('signinReducer', () => {

    it('SIGNIN_REQUEST', () => {
        const user = {} as IUser;
        const formGroup = { value: user } as FormGroup;
        expect(signinReducer({}, new SigninRequest(formGroup))).toEqual({ user, error: null });
    });
    it('SIGNIN_ERROR', () => {
        const error = { error: 'bob' };
        expect(signinReducer({}, new SigninError(error))).toEqual({ error });
    });
    it('SIGNIN_ERROR', () => {
        expect(signinReducer({}, new ResetError())).toEqual({ error: null });
    });
    it('RESET', () => {
        expect(signinReducer({}, new Reset())).toEqual({});
    });
    it('default', () => {
        expect(signinReducer({}, { type: null })).toEqual({});
    });
});