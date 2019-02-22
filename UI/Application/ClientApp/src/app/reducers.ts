import { ActionReducer, MetaReducer } from '@ngrx/store';
import { environment } from '../environments/environment';
//import { messagerReducer, MessagerState } from './components/messager/reducer';

export interface RootStore {
    //messager: MessagerState;
}

// console.log all actions
export function logger(reducer: ActionReducer<RootStore>): ActionReducer<RootStore> {
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
    //messager: messagerReducer
};