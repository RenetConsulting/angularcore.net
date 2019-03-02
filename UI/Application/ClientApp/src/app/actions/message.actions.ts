import { Action } from '@ngrx/store';
import { IError } from '../interfaces/error';
import { MessageTypes } from '../types/message.types';

export class ErrorRequest implements Action {
    readonly type = MessageTypes.ERROR_REQUEST;
    constructor(readonly payload: IError) { }
}

export class ErrorSuccess implements Action {
    readonly type = MessageTypes.ERROR_SUCCESS;
    constructor(readonly payload: IError) { }
}

export class MessageRequest implements Action {
    readonly type = MessageTypes.MESSAGE_REQUEST;
    constructor(readonly payload: string) { }
}

export class MessageSuccess implements Action {
    readonly type = MessageTypes.MESSAGE_SUCCESS;
    constructor(readonly payload: string) { }
}

export type MessageActionsUnion = ErrorRequest | ErrorSuccess | MessageRequest | MessageSuccess;