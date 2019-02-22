import { createSelector } from '@ngrx/store';
import { ResetPasswordState, ResetPasswordStore } from './reducer';

const getModule = (state: ResetPasswordStore) => state.resetPassword;

const getError = (state: ResetPasswordState) => state.error;

export const selectResetPasswordError = createSelector(getModule, getError);