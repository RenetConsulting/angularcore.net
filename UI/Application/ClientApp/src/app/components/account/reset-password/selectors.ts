import { createSelector } from '@ngrx/store';
import { RootStore } from '~/reducers';
import { ResetPasswordState } from './reducer';

const getModule = (state: RootStore) => state.resetPassword;
const getError = (state: ResetPasswordState) => state.error;

export const selectResetPasswordError = createSelector(getModule, getError);