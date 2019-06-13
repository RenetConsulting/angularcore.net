import { SettingsActionsUnion } from '~/actions/settings.actions';
import { ISettings } from '~/interfaces/settings';
import { SettingsTypes } from '~/types/settings.types';

const INITIAL_STATE: ISettings = {};

export function settingsReducer(state = INITIAL_STATE, action: SettingsActionsUnion): ISettings {

    switch (action.type) {

        case SettingsTypes.SET_SETTINGS: return { ...action.payload };
        default: return state;
    }
}