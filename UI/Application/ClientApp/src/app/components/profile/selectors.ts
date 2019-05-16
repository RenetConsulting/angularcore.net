import { createSelector } from '@ngrx/store';
import { RootStore } from '~/reducers';
import { ProfileState } from './reducer';

const getModule = (state: RootStore) => state.profile;
const getError = (state: ProfileState) => state.error;
const getProfile = (state: ProfileState) => state && state.profile;

export const selectProfileError = createSelector(getModule, getError);
export const selectProfile = createSelector(getModule, getProfile);