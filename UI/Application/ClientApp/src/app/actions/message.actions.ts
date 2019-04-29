import { Action } from '@ngrx/store';
import { IError } from '../interfaces/error';
import { MessageTypes } from '../types/message.types';

export class SetError implements Action {
    readonly type = MessageTypes.SET_ERROR;
    constructor(readonly payload: IError) { }
}

export class SetSuccess implements Action {
    readonly type = MessageTypes.SET_SUCCESS;
    constructor(readonly payload: string) { }
}

export type MessageActionsUnion = SetError | SetSuccess;