import { ActionReducerMap } from '@ngrx/store';
import { ChangePasswordState } from './components/account/change-password/reducer';
import { ResetPasswordState } from './components/account/reset-password/reducer';
import { authReducer, AuthState } from './components/auth/reducer';
import { ProfileState } from './components/profile/reducer';
import { ThemeState } from './components/theme-picker/reducer';
import { ISettings } from './interfaces/settings';
import { settingsReducer } from './reducers/settings.reducer';

export interface RootStore {
    auth?: AuthState;
    theme?: ThemeState;
    profile?: ProfileState;
    resetPassword?: ResetPasswordState;
    changePassword?: ChangePasswordState;
    settings?: ISettings;
}

export const REDUCERS: ActionReducerMap<RootStore> = {
    auth: authReducer,
    settings: settingsReducer
};