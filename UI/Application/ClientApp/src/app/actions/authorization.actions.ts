import { Action } from '@ngrx/store';
import { AuthorizationTypes } from '../types/authorization.types';

export class Signout implements Action {
    readonly type = AuthorizationTypes.SIGNOUT;
    constructor() { }
}

export type AuthorizationUnion = Signout;