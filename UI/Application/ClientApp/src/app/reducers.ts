import { ActionReducer, MetaReducer } from '@ngrx/store';
import * as Messager from './core/messager/reducer';

export interface RootStore {
    messager: Messager.State;
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

export const metaReducers: MetaReducer<any>[] = [logger];

export const REDUCERS = {
    messager: Messager.reducer
};