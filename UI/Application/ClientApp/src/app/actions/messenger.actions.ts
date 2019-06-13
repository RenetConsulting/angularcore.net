import { Action } from '@ngrx/store';
import { IError } from '../interfaces/error';
import { MessengerTypes } from '../types/messenger.types';

export class SetError implements Action {
    readonly type = MessengerTypes.SET_ERROR;
    constructor(readonly payload: IError) { }
}
export class SetSuccess implements Action {
    readonly type = MessengerTypes.SET_SUCCESS;
    constructor(readonly payload: string) { }
}

export type MessengerActionsUnion = SetError | SetSuccess;