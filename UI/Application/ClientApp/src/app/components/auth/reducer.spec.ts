import { FormGroup } from '@angular/forms';
import { Reset } from '~/actions/root.actions';
import { IUser } from '~/interfaces/user';
import { SetAuthorized } from './actions';
import { authReducer } from './reducer';
import { ResetError, SigninError, SigninRequest, SigninSuccess } from './signin/actions';
import { SignupError, SignupRequest } from './signup/actions';

describe('authReducer', () => {

    it('SIGNIN_REQUEST', () => {
        const user = {} as IUser;
        const formGroup = { value: user } as FormGroup;
        expect(authReducer({}, new SigninRequest(formGroup))).toEqual({ user, signinError: null });
    });
    it('SIGNIN_ERROR', () => {
        const signinError = { error: 'bob' };
        expect(authReducer({}, new SigninError(signinError))).toEqual({ signinError });
    });
    it('SIGNIN_ERROR', () => {
        expect(authReducer({}, new ResetError())).toEqual({ signinError: null });
    });
    it('SIGNUP_REQUEST', () => {
        const user = {} as IUser;
        const formGroup = { value: user } as FormGroup;
        expect(authReducer({}, new SignupRequest(formGroup))).toEqual({ user, signupError: null });
    });
    it('SIGNUP_ERROR', () => {
        const signupError = { error: 'bob' };
        expect(authReducer({}, new SignupError(signupError))).toEqual({ signupError });
    });
    it('SIGNIN_SUCCESS', () => {
        expect(authReducer({}, new SigninSuccess(null, null))).toEqual({});
    });
    it('SIGNIN_SUCCESS', () => {
        const authorized = true;
        expect(authReducer({}, new SetAuthorized({ authorized }))).toEqual({ authorized });
    });
    it('RESET', () => {
        expect(authReducer({}, new Reset())).toEqual({});
    });
    it('default', () => {
        expect(authReducer({}, { type: null })).toEqual({});
    });
});
