import { ActionReducerMap } from '@ngrx/store';
import { ChangePasswordState } from './components/account/change-password/reducer';
import { ResetPasswordState } from './components/account/reset-password/reducer';
import { SigninState } from './components/authorization/signin/reducer';
import { SignupState } from './components/authorization/signup/reducer';
import { profileReducer, ProfileState } from './components/profile/reducer';
import { ThemeState } from './components/theme-picker/reducer';

export interface RootStore {
    signin?: SigninState;
    signup?: SignupState;
    theme?: ThemeState;
    persons?: ProfileState;
    resetPassword?: ResetPasswordState;
    changePassword?: ChangePasswordState;
}

export const REDUCERS: ActionReducerMap<RootStore> = {
    persons: profileReducer
};