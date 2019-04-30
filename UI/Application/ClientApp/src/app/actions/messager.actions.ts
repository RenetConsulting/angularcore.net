import { Action } from '@ngrx/store';
import { IError } from '../interfaces/error';
import { MessagerTypes } from '../types/messager.types';

export class SetError implements Action {
    readonly type = MessagerTypes.SET_ERROR;
    constructor(readonly payload: IError) { }
}

export class SetSuccess implements Action {
    readonly type = MessagerTypes.SET_SUCCESS;
    constructor(readonly payload: string) { }
}

export type MessagerActionsUnion = SetError | SetSuccess;