import { ActionReducer } from '@ngrx/store';
import { RootStore } from '~/reducers';

// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

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

/** DEVELOPMENT */
export const environment = {
    production: false,
    metaReducers: [logger]
};
