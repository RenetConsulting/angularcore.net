import { createSelector } from '@ngrx/store';
import { RootStore } from '~/reducers';
import { AuthState } from './reducer';

const getModule = (state: RootStore) => state.auth;
const getSigninError = (state: AuthState) => state.signinError;
const getSignupError = (state: AuthState) => state.signupError;
const getUser = (state: AuthState) => state && state.user;
const getAuthorized = (state: AuthState) => state && state.authorized;

export const selectSigninError = createSelector(getModule, getSigninError);
export const selectSignupError = createSelector(getModule, getSignupError);
export const selectAuthUser = createSelector(getModule, getUser);
export const selectAuthorized = createSelector(getModule, getAuthorized);