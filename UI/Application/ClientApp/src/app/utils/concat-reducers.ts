import { Action, ActionReducer } from '@ngrx/store';

export const concatReducers = <StoreType>(...reducers: Array<ActionReducer<StoreType>>) =>
    (store: StoreType, action: Action) => reducers.reduce((prevStore: StoreType, currentReducer: ActionReducer<StoreType>) => {
        return currentReducer(prevStore, action);
    }, store);