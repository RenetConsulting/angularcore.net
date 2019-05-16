import { Action } from '@ngrx/store';
import { AuthTypes } from './types';

export class SignoutRequest implements Action {
    readonly type = AuthTypes.SIGNOUT_REQUEST;
    constructor() { }
}
export class SignoutSuccess implements Action {
    readonly type = AuthTypes.SIGNOUT_SUCCESS;
    constructor() { }
}
export class SignoutError implements Action {
    readonly type = AuthTypes.SIGNOUT_ERROR;
    constructor() { }
}

export class SetAuthorized implements Action {
    readonly type = AuthTypes.SET_AUTHORIZED;
    constructor(readonly payload: boolean) { }
}

export type AuthActionsUnion = SignoutRequest | SignoutSuccess | SignoutError | SetAuthorized;