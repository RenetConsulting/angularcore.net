import { createSelector } from '@ngrx/store';
import { ISettings } from '~/interfaces/settings';
import { RootStore } from '~/reducers';

const getModule = (state: RootStore) => state.settings;
const getFacebookAppId = (state: ISettings) => state.facebookAppId;
const getGoogleClientId = (state: ISettings) => state.googleClientId;

export const selectFacebookAppId = createSelector(getModule, getFacebookAppId);
export const selectGoogleClientId = createSelector(getModule, getGoogleClientId);