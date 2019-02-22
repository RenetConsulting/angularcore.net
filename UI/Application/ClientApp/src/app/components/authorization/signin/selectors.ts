import { createSelector } from '@ngrx/store';
import { RootStore } from '../../../reducers';
import { SigninState } from './reducer';

const getModule = (state: RootStore) => state.signin;

const getError = (state: SigninState) => state.error;

const getUser = (state: SigninState) => state && state.user;

export const selectSigninError = createSelector(getModule, getError);

export const selectSigninUser = createSelector(getModule, getUser);