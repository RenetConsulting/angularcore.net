import { Action } from '@ngrx/store';
import { ISettings } from '~/interfaces/settings';
import { SettingsTypes } from '~/types/settings.types';

export class SetSettings implements Action {
    readonly type = SettingsTypes.SET_SETTINGS;
    constructor(readonly payload: ISettings) { }
}

export type SettingsActionsUnion = SetSettings;