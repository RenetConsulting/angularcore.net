import { createSelector } from '@ngrx/store';
import { ChangePasswordState, ChangePasswordStore } from './reducer';

const getModule = (state: ChangePasswordStore) => state.changePassword;

const getError = (state: ChangePasswordState) => state.error;

export const selectChangePasswordError = createSelector(getModule, getError);