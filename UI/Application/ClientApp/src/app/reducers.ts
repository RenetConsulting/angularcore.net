import { ActionReducer, MetaReducer } from '@ngrx/store';
import { environment } from '../environments/environment';
import { SigninState } from './components/authorization/signin/reducer';
import { SignupState } from './components/authorization/signup/reducer';
import { MessagerState } from './components/messager/reducer';
import { profileReducer, ProfileState } from './components/profile/reducer';
import { ThemeState } from './components/theme-picker/reducer';
import { concatReducers } from './utils/concat-reducers';

export interface RootStore {
    messager: MessagerState;
    signin: SigninState;
    signup: SignupState;
    theme: ThemeState;
    persons: ProfileState;
}

function logger(reducer: ActionReducer<RootStore>): ActionReducer<RootStore> {
    return (state: RootStore, action: any): any => {
        const result = reducer(state, action);
        console.groupCollapsed(action.type);
        console.log('prev state', state);
        console.log('action', action);
        console.log('next state', result);
        console.groupEnd();
        return result;
    };
}

export const metaReducers: MetaReducer<any>[] = !environment.production ? [logger] : null;

export const REDUCERS = {
    persons: concatReducers(profileReducer)
};