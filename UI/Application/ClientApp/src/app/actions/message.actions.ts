import { Action } from '@ngrx/store';
import { IError } from '../interfaces/error';
import { MessageTypes } from '../types/message.types';

export class SetError implements Action {
    readonly type = MessageTypes.SET_ERROR;
    constructor(readonly payload: IError) { }
}

export class PushError implements Action {
    readonly type = MessageTypes.PUSH_ERROR;
    constructor(readonly payload: IError) { }
}

export class SetSuccessMessage implements Action {
    readonly type = MessageTypes.SET_SUCCESS_MESSAGE;
    constructor(readonly payload: string) { }
}

export type MessageActionsUnion = SetError | PushError | SetSuccessMessage;