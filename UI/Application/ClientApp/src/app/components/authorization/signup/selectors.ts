import { createSelector } from '@ngrx/store';
import { RootStore } from '../../../reducers';
import { SignupState } from './reducer';

const getModule = (state: RootStore) => state.signup;

const getError = (state: SignupState) => state.error;

const getUser = (state: SignupState) => state && state.user;

export const selectSignupError = createSelector(getModule, getError);

export const selectSignupUser = createSelector(getModule, getUser);