import { createSelector } from '@ngrx/store';
import { RootStore } from '~/reducers';
import { ProfileState } from './reducer';

const getModule = (state: RootStore) => state.profile;
const getProfile = (state: ProfileState) => state && state.profile;

export const selectProfile = createSelector(getModule, getProfile);