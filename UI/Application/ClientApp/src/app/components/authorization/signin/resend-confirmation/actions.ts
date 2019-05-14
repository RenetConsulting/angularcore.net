import { Action } from '@ngrx/store';
import { ResendConfirmationTypes } from './types';

export class ResendConfirmationRequest implements Action {
    readonly type = ResendConfirmationTypes.RESEND_CONFIRMATION_REQUEST;
    constructor(readonly payload: string) { }
}
export class ResendConfirmationSuccess implements Action {
    readonly type = ResendConfirmationTypes.RESEND_CONFIRMATION_SUCCESS;
}
export class ResendConfirmationError implements Action {
    readonly type = ResendConfirmationTypes.RESEND_CONFIRMATION_ERROR;
    constructor(readonly error) { }
}

export type AccountActionsUnion =  ResendConfirmationRequest | ResendConfirmationSuccess | ResendConfirmationError;