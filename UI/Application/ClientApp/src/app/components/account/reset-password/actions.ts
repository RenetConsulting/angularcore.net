import { FormGroup } from '@angular/forms';
import { Action } from '@ngrx/store';
import { ResetPasswordTypes } from './types';

export class ResetPassword implements Action {
    readonly type = ResetPasswordTypes.RESET_PASSWORD_REQUEST;
    constructor(readonly payload: FormGroup) { }
}
export class ResetPasswordSuccess implements Action {
    readonly type = ResetPasswordTypes.RESET_PASSWORD_SUCCESS;
}
export class ResetPasswordError implements Action {
    readonly type = ResetPasswordTypes.RESET_PASSWORD_ERROR;
    constructor(readonly error) { }
}
export class ResetError implements Action {
    readonly type = ResetPasswordTypes.RESET_ERROR;
}

export type ResetPasswordActionsUnion = ResetPassword | ResetPasswordSuccess | ResetPasswordError | ResetError;