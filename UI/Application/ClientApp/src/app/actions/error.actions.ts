import { Action } from '@ngrx/store';
import { IError } from '../interfaces/error';
import { ErrorTypes } from '../types/error.types';

export class SetError implements Action {

    readonly type = ErrorTypes.SET_ERROR;

    constructor(readonly payload: IError) { }
}

export class PushError implements Action {

    readonly type = ErrorTypes.PUSH_ERROR;

    constructor(readonly payload: IError) { }
}


export class SetSuccessMessage implements Action {

    readonly type = ErrorTypes.SET_SUCCESS_MESSAGE;

    constructor(readonly payload: string) { }
}

export class Reset implements Action {

    readonly type = ErrorTypes.RESET;
}

export type ErrorActionsUnion = SetError | PushError | SetSuccessMessage | Reset;