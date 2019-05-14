import { FormGroup } from '@angular/forms';
import { Reset } from '~/actions/root.actions';
import { IUser } from '~/interfaces/user';
import { SigninSuccess } from '../signin/actions';
import { SignupError, SignupRequest } from './actions';
import { signupReducer } from './reducer';

describe('signupReducer', () => {

    it('SIGNUP_REQUEST', () => {
        const user = {} as IUser;
        const formGroup = { value: user } as FormGroup;
        expect(signupReducer({}, new SignupRequest(formGroup))).toEqual({ user, error: null });
    });
    it('SIGNUP_ERROR', () => {
        const error = { error: 'bob' };
        expect(signupReducer({}, new SignupError(error))).toEqual({ error });
    });
    it('SIGNIN_SUCCESS', () => {
        expect(signupReducer({}, new SigninSuccess(null, null))).toEqual({});
    });
    it('RESET', () => {
        expect(signupReducer({}, new Reset())).toEqual({});
    });
    it('default', () => {
        expect(signupReducer({}, { type: null })).toEqual({});
    });
});